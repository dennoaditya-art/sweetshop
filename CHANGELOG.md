# Changelog

All notable changes to SweetShop Starter.

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
