import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: Request) {
  // Detect Stripe webhook by header (case-insensitive)
  const stripeSig = request.headers.get("stripe-signature") || request.headers.get("Stripe-Signature")
  if (stripeSig) {
    const webhookKey = process.env.STRIPE_WEBHOOK_KEY ?? ""
    const secretKey = process.env.STRIPE_SECRET_KEY ?? ""
    if (!webhookKey || webhookKey.includes("xxxxx") || !secretKey) {
      return NextResponse.json({ error: "Stripe webhook not configured — set STRIPE_WEBHOOK_KEY" }, { status: 503 })
    }
    const rawBody = await request.text()
    try {
      const { default: Stripe } = await import("stripe")
      const stripe = new Stripe(secretKey)
      const event = await stripe.webhooks.constructEventAsync(rawBody, stripeSig, webhookKey)
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any
        const orderId = session.metadata?.orderId as string | undefined
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "paid", status: "diproses", paidAt: new Date() },
          })
        }
      } else if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
        const session = event.data.object as any
        const orderId = session.metadata?.orderId as string | undefined
        if (orderId) {
          await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: "failed" } })
        }
      }
      return NextResponse.json({ ok: true })
    } catch (e: any) {
      console.error("[stripe webhook]", e.message)
      return NextResponse.json({ error: `Stripe webhook error: ${e.message}` }, { status: 400 })
    }
  }

  // Midtrans webhook
  try {
    const body = await request.json()
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = body
    if (!order_id || !signature_key) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? ""
    if (!serverKey || serverKey.includes("dummy")) {
      return NextResponse.json({ error: "Webhook disabled — set MIDTRANS_SERVER_KEY" }, { status: 503 })
    }
    const expected = crypto.createHash("sha512").update(`${order_id}${status_code}${gross_amount}${serverKey}`).digest("hex")
    if (expected !== signature_key) return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
    let paymentStatus = "pending"
    let orderStatus: string | undefined
    if (["capture", "settlement"].includes(transaction_status)) { paymentStatus = "paid"; orderStatus = "diproses" }
    else if (["deny", "expire", "failure", "cancel"].includes(transaction_status)) { paymentStatus = "failed" }
    else if (transaction_status === "pending") paymentStatus = "pending"
    const orderId = order_id.split("-")[0]
    const order = await prisma.order.findFirst({ where: { OR: [{ midtransOrderId: order_id }, { id: orderId }] } })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus, status: orderStatus ?? undefined, paidAt: paymentStatus === "paid" ? new Date() : undefined },
    })
    return NextResponse.json({ ok: true })
  } catch (e) { console.error(e); return NextResponse.json({ error: "Webhook error" }, { status: 500 }) }
}

export const runtime = "nodejs"
