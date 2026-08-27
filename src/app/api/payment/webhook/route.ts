import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: Request) {
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

    // map midtrans status -> paymentStatus
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
