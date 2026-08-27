import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

function parseProduct(p: any) {
  return { ...p, images: JSON.parse(p.images), tags: JSON.parse(p.tags), variants: JSON.parse(p.variants) }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const kategori = searchParams.get("kategori")
  const q = searchParams.get("q")
  const slug = searchParams.get("slug")
  if (slug) {
    const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } })
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })
    return NextResponse.json({ product: parseProduct(product) })
  }
  const where: Record<string, unknown> = {}
  if (kategori) where.categoryId = kategori
  if (q) (where as any).OR = [{ name: { contains: q } }, { description: { contains: q } }]
  const products = await prisma.product.findMany({ where, include: { category: true }, orderBy: { createdAt: "desc" } })
  return NextResponse.json({ products: products.map(parseProduct) })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: {
        name: body.name, slug: body.slug, description: body.description,
        price: body.price, originalPrice: body.originalPrice ?? undefined,
        image: body.image, images: JSON.stringify(body.images ?? [body.image]),
        categoryId: body.categoryId, tags: JSON.stringify(body.tags ?? []),
        rating: body.rating ?? 0, sold: body.sold ?? 0,
        isBestSeller: body.isBestSeller ?? false, isNew: body.isNew ?? false,
        stock: body.stock ?? 0, variants: JSON.stringify(body.variants ?? []),
      },
    })
    return NextResponse.json({ product: parseProduct(product) }, { status: 201 })
  } catch { return NextResponse.json({ error: "Gagal membuat produk" }, { status: 400 }) }
}
