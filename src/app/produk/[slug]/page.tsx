import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { notFound } from "next/navigation"
import { parseProduct } from "@/lib/product"
import { ProductDetailClient } from "./client"

export const dynamic = "force-dynamic"

export default async function ProdukPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = await prisma.product.findUnique({ where: { slug }, include: { category: true } })
  if (!raw) notFound()
  const product = parseProduct(raw)
  return (
    <div className="flex flex-col min-h-screen">
      <Header /><CartDrawer />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8 w-full">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </div>
  )
}
