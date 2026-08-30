import { prisma } from "@/lib/prisma"
import { parseProduct } from "@/lib/product"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductCard } from "@/components/product-card"
import { siteConfig } from "@/config/site"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function MenuPage({ searchParams }: { searchParams: Promise<{ kategori?: string; q?: string }> }) {
  const { kategori, q } = await searchParams
  const where: any = {}
  if (kategori) where.categoryId = kategori
  if (q) where.OR = [{ name: { contains: q } }, { description: { contains: q } }]
  const [rawProducts, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
  ])
  await new Promise((r) => setTimeout(r, 1400))
  const products = rawProducts.map(parseProduct)
  return (
    <div className="flex flex-col min-h-screen">
      <Header /><CartDrawer />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8 w-full">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Menu <span className="glaze-text">{siteConfig.name}</span></h1>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/menu" className={`px-4 py-2 rounded-full text-sm font-medium border ${!kategori ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]" : "bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)]"}`}>All</Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/menu?kategori=${c.id}`} className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-1.5 ${kategori === c.id ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]" : "bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)]"}`}>
              <span>{c.emoji}</span> {c.name}
            </Link>
          ))}
        </div>
        <form action="/menu" className="mt-4 flex gap-2 max-w-md">
          <input name="q" defaultValue={q ?? ""} placeholder="Search flavors..." className="flex-1 h-10 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] placeholder:text-[var(--muted-foreground)] px-4 text-sm" />
          <button type="submit" className="h-10 px-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold">Search</button>
        </form>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {products.length === 0 && <p className="text-center text-sm text-[var(--muted-foreground)] py-12">No products found.</p>}
      </main>
      <Footer />
    </div>
  )
}
