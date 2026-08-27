import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { siteConfig } from "@/config/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.siteUrl.replace(/\/$/, "")
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/menu`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/checkout`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ]
  try {
    const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } })
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${base}/produk/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }))
    return [...staticRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}
