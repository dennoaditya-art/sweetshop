import { siteConfig } from "@/config/site"
import { prisma } from "@/lib/prisma"

/**
 * Resolve site config: DB SiteConfig overrides file config.
 * ponytail: simple key-value, no JSON complexity unless needed.
 */
export async function getSiteConfig() {
  try {
    const rows = await (prisma as any).siteConfig.findMany()
    if (rows.length === 0) return siteConfig
    const map = Object.fromEntries(rows.map((r: any) => [r.key, r.value]))
    return {
      ...siteConfig,
      name: map.siteName ?? siteConfig.name,
      tagline: map.siteTagline ?? siteConfig.tagline,
      description: map.siteDescription ?? siteConfig.description,
      footerText: map.footerText ?? siteConfig.footerText,
      contactEmail: map.contactEmail ?? siteConfig.contactEmail,
    }
  } catch {
    return siteConfig
  }
}
