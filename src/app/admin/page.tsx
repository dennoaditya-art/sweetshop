import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { parseProduct } from "@/lib/product"
import { AdminClient } from "./client"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const session = await getSession()
  if (!session) redirect("/admin/login")
  const [rawProducts, categories, orders] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 100 }),
  ])
  const products = rawProducts.map(parseProduct)
  return <AdminClient products={products} categories={categories} orders={orders} />
}
