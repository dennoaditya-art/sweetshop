# Product

## Register

product

## Users

- **Buyer Gumroad** (toko es krim/gelato kecil, UMKM, founder non-teknis): beli starter di Gumroad, rebrand 5 menit (`site.ts` + `theme.ts`), deploy 15 menit ke Vercel+Turso, langsung jualan internasional (mock/Midtrans/Stripe). Konteks: laptop, butuh docs jelas, takut `admin123` dan env trap.
- **End customer** (pencinta es krim/gelato, 18-35, mobile-first): browse menu, pilih variant, cart, checkout (COD/Stripe/Midtrans), lacak pesanan via `pesanan/[id]?phone=`. Konteks: HP, sinyal sedang, butuh cepat, visual glossy menggugah selera.

## Product Purpose

White-label e-commerce starter Next.js 16 untuk toko es krim/gelato artisan — bukan demo. Stock atomic (`updateMany where stock>=qty`), pembayaran internasional (Stripe Checkout real, Midtrans, mock), i18n id/en, dark mode, abandoned cart recovery manual (WA/CSV, auto via Resend jika ada domain), SEO JSON-LD. Sukses = buyer Gumroad bisa jual dalam 15 menit tanpa coding Stripe/email dari nol.

## Brand Personality

**Playful Glossy Premium — Toko Es Krim & Gelato Artisan.** 
3 kata: *glossy, soft, addictive* (hero: "Sweet like glaze"). Rasa: donut-nails chrome, rhinestone sparkle, french-tip arc, glass-card. Suasana toko fisik es krim boutique di mall premium: cahaya terang, warna strawberry/pistachio/taro, ramah tapi tidak childish. Referensi feel: Glossier (retail modern glossy) + Aesop (editorial tenang) — tanpa beige generik.

## Anti-references

- **Generic AI cream**: beige/sand/parchment pucat (`OKLCH L 0.84-0.97 C<0.06`), card grid identik berulang, eyebrow uppercase kecil di tiap section, gradient text — saturated tell 2026. Hindari.
- Tidak korporat kaku (navy formal) atau brutalist kasar (hitam tebal raw) — tetap playful premium, bukan enterprise.

## Design Principles

1. **Glossy is product, not decoration** — glaze, chrome, rhinestone hanya jika menjual rasa (hero scoop, galeri video). Jika tidak bantu konversi, hapus.
2. **Rebrand in 5 min, ship in 15** — 1 file `site.ts` + DB live settings, env jelas, mock fallback tidak break.
3. **Stock truth > UI cantik** — oversell prevention dan server-side price recalc adalah premium, bukan animasi.
4. **Mobile cart is the store** — drawer, qty, dan checkout harus thumb-reach, dark-mode kontras ≥4.5:1, tanpa `bg-white` trap.
5. **International tanpa domain tetap jalan** — Stripe di vercel.app, recovery WA manual; auto-email unlocks when domain ada.

## Accessibility & Inclusion

WCAG 2.2 AA: kontras ≥4.5:1 body, ≥3:1 large, focus-visible, keyboard trap free (Radix Dialog), `prefers-reduced-motion` untuk GSAP ScrollTrigger, tap target ≥44px. Tidak ada `bg-white` hardcode (lint:tokens), `lang` dari `siteConfig.locale`.
