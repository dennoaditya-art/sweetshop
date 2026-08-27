import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
    for (const it of body.items as { product: { id: string; name: string; image: string }; variant?: string; quantity: number }[]) {
      const db = dbMap.get(it.product.id)
      if (!db) return NextResponse.json({ error: `Product not found: ${it.product.id}` }, { status: 400 })
      // variant price override
      let unitPrice = db.price
      try {
        const variants = JSON.parse(db.variants || "[]") as { name: string; price: number }[]
        const v = variants.find((x) => x.name === it.variant)
        if (v) unitPrice = v.price
      } catch {}
      const qty = Math.max(1, Math.floor(it.quantity ?? 1))
      total += unitPrice * qty
      orderItemsData.push({
        productId: db.id,
        productName: db.name,
        productPrice: unitPrice,
        variant: it.variant ?? undefined,
        quantity: qty,
        image: db.image,
      })
    }

    const order = await prisma.order.create({
      data: {
        customerName: body.customer.name,
        customerPhone: body.customer.phone,
        customerAddress: body.customer.address,
        customerNotes: body.customer.notes ?? undefined,
        total,
        status: "baru",
        paymentStatus: "pending",
        items: { create: orderItemsData },
      },
      include: { items: true },
    })
    return NextResponse.json({ order }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create order" }, { status: 400 })
  }
}
