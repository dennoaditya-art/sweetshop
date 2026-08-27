"use client"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import type { Product } from "@/types"
import { Star, ShoppingBag } from "lucide-react"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, openCart } = useStore()
  return (
    <div className="glass-card rounded-[1.5rem] overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/produk/${product.slug}`} className="relative aspect-square overflow-hidden bg-[var(--muted)]">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.isBestSeller && <Badge className="bg-[var(--primary)] text-white border-0">Best Seller</Badge>}
          {product.isNew && <Badge className="bg-[var(--secondary)] text-[var(--secondary-foreground)] border-0">Baru</Badge>}
        </div>
        {/* rhinestone sparkle */}
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full rhinestone opacity-80" />
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-1 text-xs text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" /> {product.rating.toFixed(1)} · {product.sold} terjual</div>
        <Link href={`/produk/${product.slug}`} className="font-semibold leading-tight line-clamp-2 hover:text-[var(--primary)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>{product.name}</Link>
        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <p className="font-bold text-[var(--primary)]">{formatPrice(product.price)}</p>
            {product.originalPrice && <p className="text-xs line-through text-[var(--muted-foreground)]">{formatPrice(product.originalPrice)}</p>}
          </div>
          <Button size="sm" onClick={() => { addToCart(product); openCart() }}><ShoppingBag className="w-3.5 h-3.5" /> Add</Button>
        </div>
      </div>
    </div>
  )
}
