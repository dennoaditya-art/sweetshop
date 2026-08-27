# Deploy — Vercel (Production)

SweetShop uses SQLite locally and Turso LibSQL on Vercel (because Vercel filesystem is read-only).

## 1. Turso (free)

1. Create at https://turso.tech → `turso db create sweetshop --enable-types`
2. `turso db show sweetshop --url` → copy `libsql://...`
3. `turso db tokens create sweetshop` → copy token

## 2. GitHub

```bash
cd D:\sweetshop
git init
git add .
git commit -m "feat: sweetshop v1.0.0 — white-label international starter"
git remote add origin https://github.com/YOURNAME/sweetshop-starter.git
git push -u origin main
```

## 3. Vercel

1. https://vercel.com/new → Import your GitHub repo
2. Framework preset: Next.js (auto)
3. Environment Variables (add all):
   - `DATABASE_URL` = `libsql://your-db.turso.io`
   - `DATABASE_AUTH_TOKEN` = `eyJ...`
   - `SESSION_SECRET` = 64-hex random: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-shop.vercel.app`
   - `NEXT_PUBLIC_SITE_NAME` = `Your Shop`
   - `PAYMENT_PROVIDER` = `mock` (or `midtrans`/`stripe`)
   - If midtrans: `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
4. Deploy → done
5. After deploy, seed once (Vercel → Project → Settings → Environment → Run):
   ```bash
   npx prisma generate && npm run seed
   ```
   Or seed locally against Turso: set `.env` to Turso URL and run `npm run seed`.

## 4. Verify

- `/` loads, `/menu` shows products, `/checkout` with mock → order appears in `/admin`
- `/admin/login` → `admin / admin123` → change password / create new admin later

## Local vs Production DB

| Env | DATABASE_URL |
|-----|--------------|
| Local dev | `file:./prisma/dev.db` |
| Vercel prod | `libsql://....turso.io` + `DATABASE_AUTH_TOKEN` |

No Docker, no extra infra.
