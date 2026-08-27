/**
 * White-label site config — buyer edits this one file to rebrand entire shop.
 * Also overridable live via DB SiteConfig (admin Settings).
 * ponytail: keep plain object, no abstraction overkill.
 */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "SweetShop",
  tagline: "Artisan ice cream & sweet treats",
  description: "Artisan ice cream with a fresh, glossy twist. Order online, pay your way.",
  locale: (process.env.NEXT_PUBLIC_SITE_LOCALE as "en" | "id") || "en",
  currency: (process.env.NEXT_PUBLIC_SITE_CURRENCY as "USD" | "IDR" | "EUR") || "USD",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: "hello@sweetshop.example",
  footerText: "Artisan ice cream • Made with love",
  nav: [
    { label: "Menu", href: "/menu" },
    { label: "Flavors", href: "/#flavors" },
    { label: "About", href: "/#about" },
  ] as const,
  hero: {
    badge: "Fresh drop • Artisan made",
    titleLine1: "Sweet like",
    titleLine2: "glaze",
    titleLine3: "soft, glossy, addictive",
    description: "12 flavors inspired by trending colors — strawberry milk, pistachio chrome, taro glaze. Made fresh daily.",
  },
} as const

export type SiteConfig = typeof siteConfig
