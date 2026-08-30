import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { siteConfig } from "@/config/site"

export const metadata = { title: `Privacy — ${siteConfig.name}`, description: "Privacy policy for SweetShop starter" }

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-12 prose prose-sm dark:prose-invert">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Privacy Policy</h1>
        <p className="text-[var(--muted-foreground)]">Last updated: 30 Aug 2026 — Template starter, adapt to your jurisdiction.</p>
        <h2>Data we collect</h2>
        <ul><li>Order: name, phone, address, notes (incl. email if provided)</li><li>Abandoned cart: email, items, total (only after email blur)</li><li>Cookies: session `sweetshop-session` (httpOnly, 24h)</li></ul>
        <h2>Why</h2><p>To fulfill orders, recover abandoned carts (WA/email manual via Admin), and analytics if you set <code>NEXT_PUBLIC_GA_ID</code>.</p>
        <h2>Retention</h2><p>Abandoned carts: delete after 30 days via <code>prisma.abandonedCart.deleteMany</code> cron (buyer to schedule). Orders retained per legal need.</p>
        <h2>Your rights</h2><p>EU GDPR: contact <code>{siteConfig.contactEmail}</code> for access/deletion. Cookie banner not required if only essential session; add consent if you add marketing cookies.</p>
        <h2>Contact</h2><p>{siteConfig.contactEmail} — {siteConfig.footerText}</p>
      </main>
      <Footer />
    </div>
  )
}
