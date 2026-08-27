"use client"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types"
import { Star, Minus, Plus, ShoppingBag } from "lucide-react"

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart, openCart } = useStore()
  const [variant, setVariant] = useState<string | undefined>(product.variants[0]?.name)
  const [qty, setQty] = useState(1)
  const price = product.variants.find((v) => v.name === variant)?.price ?? product.price

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="glass-card rounded-[2rem] overflow-hidden p-3">
        <img src={product.image} alt={product.name} className="w-full aspect-square rounded-2xl object-cover" />
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">{product.isBestSeller && <Badge className="bg-[var(--primary)] text-white border-0">Best Seller</Badge>}{product.isNew && <Badge className="bg-[var(--secondary)] border-0">Baru</Badge>}</div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{product.name}</h1>
        <div className="flex items-center gap-2 text-sm"><Star className="w-4 h-4 fill-amber-400 stroke-amber-400" /> {product.rating.toFixed(1)} · {product.sold} terjual · Stok {product.stock}</div>
        <p className="text-[var(--muted-foreground)]">{product.description}</p>
        {product.variants.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Varian</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button key={v.name} onClick={() => setVariant(v.name)} className={`px-4 py-2 rounded-full text-sm font-medium border ${variant === v.name ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white border-[var(--border)]"}`}>
                  {v.name} — {formatPrice(v.price)}
                </button>
              ))}
            </div>
          </div>
        )}
        <p className="text-2xl font-bold text-[var(--primary)]">{formatPrice(price)}</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-[var(--border)] rounded-full px-2 py-1 bg-white">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-full border flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
            <span className="w-8 text-center font-bold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
          </div>
          <Button size="lg" className="flex-1" onClick={() => { addToCart(product, variant, qty); openCart() }}><ShoppingBag className="w-4 h-4" /> Tambah ke Keranjang</Button>
        </div>
      </div>
    </div>
  )
}
