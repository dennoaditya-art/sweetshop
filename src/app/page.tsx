import { prisma } from "@/lib/prisma"
import { parseProduct } from "@/lib/product"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { HomeScenes } from "@/components/home-scenes"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [rawProducts, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
  ])
  // keep premium loading visible longer — adjust 1800ms to taste
  await new Promise((r) => setTimeout(r, 1800))
  const products = rawProducts.map(parseProduct)
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <HomeScenes products={products} categories={categories} />
      </main>
      <Footer />
    </div>
  )
}
