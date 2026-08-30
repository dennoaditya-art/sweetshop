import { prisma } from "@/lib/prisma"
import { parseProduct } from "@/lib/product"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductCard } from "@/components/product-card"
import { siteConfig } from "@/config/site"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const metadata = { title: `Flavors — ${siteConfig.name}`, description: "Explore 12 artisan flavors — strawberry, pistachio, taro and more" }

const flavorMeta: Record<string, { bg: string; accent: string; emoji: string; desc: string }> = {
  "ice-cream": { bg: "#FFE6EF", accent: "#FF6B9D", emoji: "🍦", desc: "Scoop es krim artisan" },
  sundae: { bg: "#E6F7ED", accent: "#6BCB77", emoji: "🍨", desc: "Sundae & parfait" },
  drink: { bg: "#EDE7FF", accent: "#8B7DD9", emoji: "🥤", desc: "Milkshake & minuman segar" },
  dessert: { bg: "#FFF0E6", accent: "#FFB5D8", emoji: "🍰", desc: "Dessert box & panna cotta" },
  bundle: { bg: "#FFF9F5", accent: "#FF6B9D", emoji: "🎀", desc: "Bundle hemat berbagi" },
}

export default async function FlavorsPage() {
  const [rawProducts, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
  ])
  const products = rawProducts.map(parseProduct)

  return (
    <div className="flex flex-col min-h-screen">
      <Header /><CartDrawer />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8 w-full">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Our <span className="glaze-text">Flavors</span></h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl">12 flavors terinspirasi warna trending — pilih kategori atau jelajahi semua. Klik kartu untuk detail & checkout.</p>

        <div className="flex flex-wrap gap-2 mt-6">
          <Link href="/flavors" className="px-4 py-2 rounded-full text-sm font-medium border bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]">All</Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/menu?kategori=${c.id}`} className="px-4 py-2 rounded-full text-sm font-medium border bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)] flex items-center gap-1.5">
              <span>{c.emoji}</span> {c.name}
            </Link>
          ))}
        </div>

        {categories.length === 0 && <p className="text-sm text-[var(--muted-foreground)] py-12 text-center">Belum ada kategori — seed DB dulu: <code>npm run seed</code></p>}

        <div className="mt-8 space-y-10">
          {categories.map((cat) => {
            const meta = flavorMeta[cat.id] ?? { bg: "#FFF0E6", accent: "#FF6B9D", emoji: cat.emoji, desc: cat.description }
            const catProducts = products.filter((p) => (p as any).categoryId === cat.id || (p as any).category?.id === cat.id)
            return (
              <section key={cat.id} id={`flavor-${cat.id}`} className="rounded-[1.5rem] border border-[var(--border)] overflow-hidden">
                <div className="px-4 py-4 flex items-center gap-3" style={{ background: meta.bg }}>
                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 bg-white" style={{ borderColor: meta.accent }}>{meta.emoji}</span>
                  <div>
                    <h2 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>{cat.name}</h2>
                    <p className="text-xs text-[var(--muted-foreground)]">{cat.description} — {catProducts.length} produk</p>
                  </div>
                  <Link href={`/menu?kategori=${cat.id}`} className="ml-auto text-xs px-3 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--muted)]">Lihat semua</Link>
                </div>
                <div className="p-4 bg-[var(--card)]">
                  {catProducts.length === 0 ? (
                    <p className="text-sm text-[var(--muted-foreground)] py-8 text-center">Belum ada produk di kategori {cat.name}.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {catProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                  )}
                </div>
              </section>
            )
          })}
        </div>

        {products.length === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center mt-8">
            <p className="font-semibold">Belum ada produk</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Jalankan <code>npm run seed</code> untuk mengisi 12 demo produk, lalu refresh.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
