import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { siteConfig } from "@/config/site"
import { Sparkles, Heart, Leaf, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = { title: `About — ${siteConfig.name}`, description: siteConfig.description }

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /><CartDrawer />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-[var(--muted)] border border-[var(--border)] text-[var(--card-foreground)]"><Sparkles className="w-3 h-3 text-[var(--primary)]" /> Our Story</span>
          <h1 className="text-4xl font-bold mt-4" style={{ fontFamily: "var(--font-display)" }}>About <span className="glaze-text">{siteConfig.name}</span></h1>
          <p className="text-[var(--muted-foreground)] mt-3">{siteConfig.description} Kami membuat es krim artisan setiap hari — glossy, soft, dan addictive.</p>

          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <div className="glass-card rounded-2xl p-5">
              <Heart className="w-6 h-6 text-[var(--primary)]" />
              <p className="font-semibold mt-2">Made with love</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">Bahan premium, tanpa pengawet berlebih. Rasa jujur.</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <Leaf className="w-6 h-6 text-[var(--primary)]" />
              <p className="font-semibold mt-2">Fresh daily</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">12 rasa terinspirasi warna trending — strawberry milk, pistachio chrome, taro glaze.</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <Clock className="w-6 h-6 text-[var(--primary)]" />
              <p className="font-semibold mt-2">Fast & flexible</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">Checkout cepat, bayar via mock / Midtrans / Stripe. Hubungi {siteConfig.contactEmail}.</p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link href="/menu"><Button size="lg">Explore Menu</Button></Link>
            <Link href="/privacy"><Button variant="outline" size="lg">Privacy</Button></Link>
          </div>

          <p className="text-xs text-[var(--muted-foreground)] mt-8">{siteConfig.footerText} — © 2026 {siteConfig.name}</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
