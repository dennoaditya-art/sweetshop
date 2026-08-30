import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

function parseProduct(p: any) { return { ...p, images: JSON.parse(p.images), tags: JSON.parse(p.tags), variants: JSON.parse(p.variants) } }

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } })
  if (!product) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 })
  return NextResponse.json({ product: parseProduct(product) })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const safeStock = body.stock != null ? Math.max(0, Math.floor(Number(body.stock))) : undefined
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name, slug: body.slug, description: body.description,
      price: body.price, originalPrice: body.originalPrice,
      image: body.image, images: body.images ? JSON.stringify(body.images) : undefined,
      categoryId: body.categoryId, tags: body.tags ? JSON.stringify(body.tags) : undefined,
      rating: body.rating, sold: body.sold, isBestSeller: body.isBestSeller, isNew: body.isNew,
      stock: safeStock, variants: body.variants ? JSON.stringify(body.variants) : undefined,
    },
  })
  return NextResponse.json({ product: parseProduct(product) })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
