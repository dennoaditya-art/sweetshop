import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const LOW_STOCK_THRESHOLD = 5

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.items?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    if (!body.customer?.name || !body.customer?.phone || !body.customer?.address) return NextResponse.json({ error: "Customer data incomplete" }, { status: 400 })

    // Security: recalculate total & price from DB, not client payload
    const productIds: string[] = body.items.map((it: any) => it.product.id)
    const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } } })
    const dbMap = new Map(dbProducts.map((p) => [p.id, p]))

    let total = 0
    const orderItemsData: any[] = []
    const stockUpdates: { productId: string; quantity: number; newStock: number; unitPrice: number; variant?: string; productName: string; image: string }[] = []

    for (const it of body.items as { product: { id: string; name: string; image: string }; variant?: string; quantity: number }[]) {
      const db = dbMap.get(it.product.id)
      if (!db) return NextResponse.json({ error: `Product not found: ${it.product.id}` }, { status: 400 })
      let unitPrice = db.price
      try {
        const variants = JSON.parse(db.variants || "[]") as { name: string; price: number }[]
        const v = variants.find((x) => x.name === it.variant)
        if (v) unitPrice = v.price
      } catch {}
      const qty = Math.max(1, Math.floor(it.quantity ?? 1))
      const newStock = db.stock - qty
      stockUpdates.push({ productId: db.id, quantity: qty, newStock, unitPrice, variant: it.variant ?? undefined, productName: db.name, image: db.image })
      total += unitPrice * qty
    }
    // Defer stock validation to atomic transaction via updateMany

    // Use transaction to ensure atomicity
    const order = await prisma.$transaction(async (tx) => {
      // ponytail: atomic decrement with stock guard — prevents TOCTOU/oversell
      for (const update of stockUpdates) {
        const res = await tx.product.updateMany({
          where: { id: update.productId, stock: { gte: update.quantity } },
          data: { stock: { decrement: update.quantity } },
        })
        if (res.count === 0) {
          throw new Error(`Insufficient stock for ${update.productName}.`)
        }
      }
      for (const u of stockUpdates) {
        orderItemsData.push({
          productId: u.productId,
          productName: u.productName,
          productPrice: u.unitPrice,
          variant: u.variant ?? undefined,
          quantity: u.quantity,
          image: u.image,
        })
      }

      // ponytail: persist email into notes if provided — schema has no dedicated email column
      const emailPrefix = body.customer.email ? `Email: ${body.customer.email}` : ""
      const notesCombined = [emailPrefix, body.customer.notes].filter(Boolean).join(" | ") || undefined
      // Create order
      const createdOrder = await tx.order.create({
        data: {
          customerName: body.customer.name,
          customerPhone: body.customer.phone,
          customerAddress: body.customer.address,
          customerNotes: notesCombined,
          total,
          status: "baru",
          paymentStatus: "pending",
          items: { create: orderItemsData },
        },
        include: { items: true },
      })

      return createdOrder
    })

    // Check for low stock after transaction and trigger alerts
    for (const update of stockUpdates) {
      if (update.newStock <= LOW_STOCK_THRESHOLD && update.newStock > 0) {
        console.warn(`[LOW STOCK] Product ${update.productId} has ${update.newStock} items remaining`)
        // In production: send email/notification to admin
      } else if (update.newStock === 0) {
        console.warn(`[OUT OF STOCK] Product ${update.productId} is now out of stock`)
        // In production: send email/notification to admin
      }
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create order" }, { status: 400 })
  }
}
