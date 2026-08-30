# SweetShop — What You Got (Gumroad Premium)

Thank you for purchasing **SweetShop Starter v2.0** — International White-Label Edition.

## 📦 Package contents

```
sweetshop/
├── src/
│   ├── app/              — Next.js 16 App Router routes + API
│   ├── components/       — header, footer, product-card, cart-drawer
│   │   └── stories/     — Storybook stories (Button, Input, Badge)
│   ├── config/           — site.ts, theme.ts, payment.ts, dict.ts (i18n)
│   ├── hooks/            — use-dict, use-reduced-motion, theme-provider
│   └── lib/              — prisma, session, crypto, store, payment
├── prisma/               — schema.prisma + seed.ts (12 products, 5 categories)
├── .storybook/           — Storybook config
├── .github/workflows/    — CI/CD GitHub Actions
├── public/               — static assets + og.png
├── docs/                 — DEPLOY.md, GUMROAD.md
├── README.md             — full setup & rebrand guide
├── LICENSE (MIT)         — commercial use allowed
└── CHANGELOG.md
```

## 🎯 Quick start

1. **Install**: `npm install`
2. **Setup**: `cp .env.example .env` + `npx prisma generate && npm run seed`
3. **Run**: `npm run dev` → http://localhost:3000
4. **Rebrand**: edit `src/config/site.ts` + `theme.ts`
5. **Deploy**: follow `docs/DEPLOY.md`

## 💎 Premium features (v2.0)

### Production-ready
- ✅ Stock management (automatic decrement + oversell prevention)
- ✅ Server-side price recalculation
- ✅ Inventory validation before order

### Multi-language
- ✅ English & Indonesian built-in
- ✅ 60+ translatable strings via `dict.ts`
- ✅ Locale switcher ready

### Dark mode
- ✅ System preference detection
- ✅ Manual toggle in header/footer
- ✅ Consistent glass-morphism styling

### Product gallery
- ✅ Multi-image support per product
- ✅ Thumbnail navigation
- ✅ Image carousel in detail page

### Abandoned cart recovery
- ✅ Email capture before checkout
- ✅ Admin → Abandoned tab (WA/Email/CSV, works without domain)
- ✅ Auto-email via Resend when `RESEND_API_KEY+EMAIL_FROM` set (requires your domain)

### Payment integrations
- ✅ Mock (COD-friendly, instant success)
- ✅ Midtrans webhook handler (real)
- ✅ Stripe Checkout real (no domain needed beyond vercel.app) + webhook

### Developer experience
- ✅ GitHub Actions CI/CD (lint, typecheck, build)
- ✅ Storybook component library
- ✅ TypeScript strict mode
- ✅ ESLint configuration

## 🔑 Demo credentials

- **Admin**: `admin / admin123` — change immediately after first login (login rate-limited 5/15m, hint removed from UI)

## 💳 Payment setup

```env
# Mock (default, COD-friendly)
PAYMENT_PROVIDER=mock

# Indonesia
PAYMENT_PROVIDER=midtrans
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxx"

# International — Stripe Checkout real
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY="sk_test_xxxxx" # add sk_live_... for live, no domain needed beyond vercel.app
STRIPE_WEBHOOK_KEY="whsec_..." # Dashboard → Webhooks → /api/payment/webhook
# Abandoned email (optional, needs your domain):
# RESEND_API_KEY="re_xxxxx"
# EMAIL_FROM="SweetShop <noreply@yourdomain.com>"
```

## 🌍 Theme customization

Edit `src/config/theme.ts` for colors:

```ts
export const themeConfig = {
  primary: "#FF6B9D",
  secondary: "#A8E6CF",
  accent: "#C3B1E1",
  // dark mode variants auto-generated
}
```

## 📱 PWA ready

- `public/manifest.json` — PWA manifest
- Offline-capable with service worker (add if needed)
- Install prompt ready

## ⚠️ Buyer rules

- ✅ Use for **unlimited** personal & commercial projects
- ✅ Use for **unlimited** client shops
- ❌ **NOT** resell unmodified source as a competing template

## 🆘 Support

- Read `README.md` for full documentation
- Read `docs/DEPLOY.md` for Vercel + Turso setup
- Check `CHANGELOG.md` for version history

Enjoy shipping! 🚀