import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { notFound } from "next/navigation"
import { parseProduct } from "@/lib/product"
import { ProductDetailClient } from "./client"
import { siteConfig } from "@/config/site"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const raw = await prisma.product.findUnique({ where: { slug } })
  if (!raw) return {}
  const p = parseProduct(raw)
  const title = `${p.name} — ${siteConfig.name}`
  const desc = p.description.slice(0, 155)
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: [p.image], type: "website" },
    alternates: { canonical: `${siteConfig.siteUrl}/produk/${p.slug}` },
  }
}

export default async function ProdukPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = await prisma.product.findUnique({ where: { slug }, include: { category: true } })
  if (!raw) notFound()
  const product = parseProduct(raw)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.length ? product.images : [product.image],
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      priceCurrency: siteConfig.currency,
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteConfig.siteUrl}/produk/${product.slug}`,
    },
    aggregateRating: product.rating ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.sold } : undefined,
  }
  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header /><CartDrawer />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8 w-full">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </div>
  )
}
