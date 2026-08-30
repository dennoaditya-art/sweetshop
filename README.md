# SweetShop Starter — White-Label E-Commerce (Next.js 16)

International, premium, production-ready starter. Rebrand in 5 minutes, deploy in 15 minutes. Built for Gumroad buyers who want to launch a real shop, not a demo.

![Next.js 16](https://img.shields.io/badge/Next.js-16-black) ![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Prisma 7](https://img.shields.io/badge/Prisma-7-2D3748) ![License MIT](https://img.shields.io/badge/license-MIT-green) ![Storybook](https://img.shields.io/badge/Storybook-ready-blue)

> **Live demo:** `https://your-vercel-url.vercel.app` (replace after deploy)  
> **Admin demo:** `/admin/login` → `admin / admin123` (change after first login)

---

## ✨ Why this is premium ($49+ value)

✅ **Production-ready**: Stock management, order validation, no overselling  
✅ **Full white-label**: 1 file `src/config/site.ts` → rename, recolor, re-currency, relocale entire shop  
✅ **Multi-language**: English & Indonesian built-in (extend via `dict.ts`)  
✅ **Full admin CRUD**: products & orders with search, pagination, live-settings  
✅ **International payments**: mock/midtrans/stripe Checkout real (Stripe needs no domain beyond vercel.app)  
✅ **Secure**: server-side total recalculation, encrypted sessions (AES-GCM), no hardcoded secrets, rate-limit login  
✅ **Dark mode**: built-in with system preference detection  
✅ **Image gallery**: product image carousel with thumbnail navigation  
✅ **Abandoned cart recovery**: email capture + Admin → Abandoned tab (WA/CSV, manual without domain, auto via Resend with domain)  
✅ **SEO & PWA**: sitemap, robots, manifest, OG, JSON-LD Product, `generateMetadata` per produk  
✅ **CI/CD**: GitHub Actions for lint, typecheck, build on every PR  
✅ **Storybook**: component library documentation for developers  
✅ **One-command setup**: SQLite locally, Turso LibSQL on Vercel

## 🗂️ What's inside

```
src/
├── app/              — App Router routes + API endpoints
│   ├── api/          — auth, products, orders, checkout, payment, abandoned-cart
│   ├── admin/        — dashboard, login, settings
│   ├── produk/[slug]/ — product detail
│   ├── cart/         — cart page
│   ├── checkout/     — checkout page
│   └── ...
├── components/       — header, footer, product-card, cart-drawer, home-scenes
├── config/           — site.ts, theme.ts, payment.ts, dict.ts (i18n)
├── lib/              — prisma, session, crypto, store, payment adapter
└── hooks/            — use-dict, use-reduced-motion
src/components/
└── stories/          — Storybook stories for Button, Input, Badge, ThemeToggle
prisma/               — schema.prisma, seed.ts (12 products, 5 categories)
.storybook/           — Storybook configuration
.github/workflows/    — CI/CD GitHub Actions
```

## 🚀 Quick start (buyer path)

```bash
# 1. Install
npm install

# 2. Env — copy & fill
cp .env.example .env
# → For local demo keep defaults (mock payment, SQLite)

# 3. Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# → paste into SESSION_SECRET in .env

# 4. DB + seed
npx prisma generate
npm run seed
# → creates admin: admin / admin123 + 12 demo products

# 5. Run
npm run dev
# → http://localhost:3000 | http://localhost:3000/admin/login
```

## 🎨 Rebrand in 5 minutes

Edit **one file**: `src/config/site.ts`

```ts
export const siteConfig = {
  name: "Your Shop Name",
  tagline: "Your tagline",
  description: "Your SEO description",
  currency: "USD", // or IDR, EUR...
  locale: "en",    // or "id"
  // ...
}
```

Edit colors: `src/config/theme.ts` → `primary, secondary, accent`

Or live: `/admin` → **Settings** tab → edit without redeploy.

## 💳 Payments — pick one ENV

```env
PAYMENT_PROVIDER=mock      # default — instant success, COD-friendly
PAYMENT_PROVIDER=midtrans  # Indonesia (QRIS/e-wallet/VA)
PAYMENT_PROVIDER=stripe    # International — Stripe Checkout real (test: sk_test_..., live: sk_live_...)
COD_ENABLED=true           # show "Pay on Delivery" option
# Stripe webhook: STRIPE_WEBHOOK_KEY=whsec_... (Dashboard → Webhooks → /api/payment/webhook)
# Without Stripe keys, provider auto-falls back to mock — no break
```

No gateway keys? `mock` works — order goes to `pending` then mock success. Set `stripe` for real Checkout (no domain needed beyond vercel.app).

## 🌍 International

- `NEXT_PUBLIC_SITE_CURRENCY` controls `formatPrice` (`USD → $`, `IDR → Rp`)
- `NEXT_PUBLIC_SITE_LOCALE` controls date/number formatting
- Menu search covers `name + description`
- Full i18n via `src/config/dict.ts`

## 🔐 Security

- Order total **recalculated server-side** from DB product prices
- Session encrypted HTTP-only cookie (`AES-GCM` + SHA-256, base64url)
- Stock atomic `updateMany where stock>=qty` prevents overselling
- No hardcoded credentials in UI, login rate-limit 5/15m, `abandoned-cart` admin-only

## 📦 Deploy to Vercel (15 min)

1. Push to GitHub
2. Vercel → Import → add ENV vars (`DATABASE_URL`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`)
3. Seed DB via Vercel Terminal: `npx prisma generate && npm run seed`

## 🧪 Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | dev server |
| `npm run build` | `prisma generate && next build` |
| `npm run seed` | seed demo data |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run storybook` | Storybook dev (port 6006) |
| `npm run build-storybook` | Static Storybook build |

## 📄 License

MIT — see `LICENSE`. Unlimited personal & commercial use.

## 🆘 Need help?

- `README.md` — full setup & rebrand guide
- `docs/GUMROAD.md` — package contents
- `docs/DEPLOY.md` — Vercel + Turso setup

Built with Next.js 16 + Tailwind v4 + Prisma + GSAP + Storybook. Crafted for sellers who ship.