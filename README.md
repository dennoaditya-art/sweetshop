# SweetShop Starter — White-Label E-Commerce (Next.js 16)

International, premium, ready-to-sell starter. Rebrand in 5 minutes, deploy in 15. Built for Gumroad buyers who want to launch a real shop, not a demo.

![Next.js 16](https://img.shields.io/badge/Next.js-16-black) ![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Prisma](https://img.shields.io/badge/Prisma-7-2D3748) ![License MIT](https://img.shields.io/badge/license-MIT-green)

> **Live demo:** `https://your-vercel-url.vercel.app` (replace after deploy)  
> **Admin demo:** `/admin/login` → `admin / admin123` (change after first login)

---

## ✨ Why this is premium ($49+ value)
- **Full white-label:** 1 file `src/config/site.ts` → rename, recolor, re-currency, relocale entire shop without find-replace. Also live-editable via `/admin` → Settings.
- **Production-ready admin:** full CRUD for products + orders with search/pagination (not just read-only).
- **International payments:** `PAYMENT_PROVIDER=mock|midtrans|stripe` — `mock` works globally out of the box (COD-friendly), Midtrans for Indonesia, Stripe stub ready to wire.
- **Secure:** order total recalculated server-side, session encrypted, no hardcoded secrets in UI.
- **SEO & PWA polish:** sitemap, robots, manifest, OG image, variant-aware cart, menu search (name+description).
- **One-command setup:** SQLite locally, Turso LibSQL on Vercel — no Docker needed.

## 🗂️ What's inside
```
/src/app          — routes (/, /menu, /produk/[slug], /checkout, /cart, /admin)
  /api            — auth, products, orders, checkout, payment (adapter)
  /components     — header, footer, product-card, cart-drawer, home-scenes (GSAP)
/src/config       — site.ts (brand), theme.ts (colors), payment.ts (provider)
/src/lib          — prisma, session, crypto, store (cart), payment adapter
/prisma           — schema.prisma, seed.ts (12 products, 5 categories)
```

## 🚀 Quick start (buyer path)

```bash
# 1. Install
npm install

# 2. Env — copy & fill only what's needed
cp .env.example .env
# → For local demo you can keep defaults as-is (mock payment, SQLite)

# 3. Generate SESSION_SECRET (important for production)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# → paste into SESSION_SECRET in .env

# 4. DB + seed
npx prisma generate
npm run seed
# → creates admin: admin / admin123 + 12 demo products

# 5. Run
npm run dev
# → http://localhost:3000  |  http://localhost:3000/admin/login
```

## 🎨 Rebrand in 5 minutes (no code search)

Edit **one file**: `src/config/site.ts`

```ts
export const siteConfig = {
  name: "Your Shop Name",
  tagline: "Your tagline",
  description: "Your SEO description",
  currency: "USD", // or IDR, EUR...
  locale: "en",    // or id
  // ...
}
```

Edit colors: `src/config/theme.ts` → `primary, secondary, accent` (mirrors `src/app/globals.css` CSS vars).

Or live: `/admin` → **Settings** tab → edit without redeploy (saved to DB `SiteConfig`).

## 💳 Payments — pick one ENV

```env
PAYMENT_PROVIDER=mock      # default — instant success, perfect for demo & COD shops
PAYMENT_PROVIDER=midtrans  # Indonesia — fill MIDTRANS_* keys
PAYMENT_PROVIDER=stripe    # International — stub now (behaves like mock), wire STRIPE_SECRET_KEY later
COD_ENABLED=true           # show "Pay on Delivery" option
```

No gateway keys? `mock` just works — order goes to `paid` immediately and appears in `/admin`.

## 🌍 International

- `NEXT_PUBLIC_SITE_CURRENCY` controls `formatPrice` (`USD → $`, `IDR → Rp`)
- `NEXT_PUBLIC_SITE_LOCALE` controls date/number formatting + search
- Menu search covers `name + description` (not just name)
- No hardcoded Indonesian strings in logic — all copy via `site.ts` / `dict.ts`

## 🔐 Security notes

- Order total is **recalculated server-side** from DB product prices (`src/app/api/checkout/route.ts`) — client cannot spoof price.
- Session is `AES-CBC` encrypted HTTP-only cookie (`src/lib/crypto.ts` / `src/lib/session.ts`), `secure` in production.
- Change `admin` password immediately after first login via `/admin` or DB.

## 📦 Deploy to Vercel (15 min)

See `docs/DEPLOY.md` — TL;DR:
1. Push to GitHub
2. Vercel → Import → add ENV vars (`DATABASE_URL` as Turso `libsql://...`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`)
3. Deploy — done. SQLite `file:./prisma/dev.db` is local only; production uses Turso.

## 🧪 Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | dev server |
| `npm run build` | `prisma generate && next build` |
| `npm run seed` | seed demo data |
| `npm run db:studio` | Prisma Studio |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

## 📄 License

MIT — see `LICENSE`. You may use for unlimited personal & commercial projects. You may not resell the unmodified template source as a competing template.

## 🆘 Need help?

- Read `docs/GUMROAD.md` (what you got, file map)
- Read `docs/DEPLOY.md` (Vercel + Turso setup)
- Issues: check `CHANGELOG.md`

Built with Next.js 16 + Tailwind v4 + Prisma + GSAP. Crafted for sellers who ship.
