# Changelog

All notable changes to SweetShop Starter.

## [2.0.0] - 2026-08-30

### Added
- **Stock management**: atomic decrement on order, oversell prevention, low-stock alerts
- **Multi-language i18n**: 60+ keys English/Indonesian via `dict.ts` + `useDict` hook
- **Dark mode**: system preference + manual toggle, full CSS variable support
- **Product image gallery**: multi-image carousel with thumbnail navigation
- **Abandoned cart recovery**: email capture, recovery tracking (`AbandonedCart` model)
- **Stripe webhook**: scaffolded handler for production integration
- **CI/CD pipeline**: GitHub Actions (lint, typecheck, build, Vercel preview)
- **Storybook component library**: Button, Input, Badge, ThemeToggle stories
- **LICENSE file**: MIT license for commercial compliance

### Changed
- Updated `checkout/route.ts`: stock validation + transaction safety
- Refactored all UI components to use i18n dictionary
- Enhanced `globals.css`: dark mode palette, glass-card dark variants
- Updated `header`, `footer`, `product-card`, `product-detail`, `cart`, `checkout`, `cart-drawer`
- Added `ThemeProvider` + `ThemeToggle` components

### Docs
- Comprehensive README with feature matrix
- Updated GUMROAD.md with v2.0 feature list
- Deployment guide improvements

### Security
- Stock validation prevents negative inventory
- Session encryption unchanged (AES-256-CBC)
- No new attack surfaces

---

## [1.0.0] - 2026-08-27
### Added
- White-label config (`src/config/site.ts`, `theme.ts`, `payment.ts`) + DB `SiteConfig` live-edit
- Full admin CRUD for products & orders with search/pagination
- Payment adapter: `mock` (international default, COD-friendly) / `midtrans` / `stripe` stub
- Server-side order total calculation (security fix)
- SEO: sitemap, robots, manifest, OG image
- Store: variant-aware pricing, menu search covers name+description
- E2E test scaffold (Playwright)

### Fixed
- Removed hardcoded `SweetScoop` strings, credential in footer
- Video fallback & poster, reduced-motion handling

### Docs
- Complete README, DEPLOY guide, Gumroad packaging