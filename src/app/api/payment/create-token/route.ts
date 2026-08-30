import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createPaymentToken } from "@/lib/payment"

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 })

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

    // extract email from customerNotes if stored as "Email: x | notes"
    const emailMatch = order.customerNotes?.match(/Email:\s*([^\s|]+@[^\s|]+)/)
    const customerEmail = emailMatch?.[1]
    const result = await createPaymentToken({
      orderId: order.id,
      total: order.total,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail,
      items: order.items.map((it) => ({ productId: it.productId, productName: it.productName, variant: it.variant, price: it.productPrice, quantity: it.quantity })),
    })

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { midtransOrderId: result.midtransOrderId, snapToken: result.snapToken },
      include: { items: true },
    })

    return NextResponse.json({ snapToken: result.snapToken, order: updated, isMock: result.isMock, provider: result.provider, url: (result as any).url })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message ?? "Failed to create payment token" }, { status: 500 })
  }
}
