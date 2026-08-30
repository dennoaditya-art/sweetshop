"use client"
import { useStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useDict } from "@/hooks/use-dict"
import { siteConfig } from "@/config/site"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useStore()
  const t = useDict(siteConfig.locale)
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-8 w-full">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{t.cartTitle}</h1>
        {cart.length === 0 ? <p className="text-sm text-[var(--muted-foreground)] mt-4">{t.emptyCart}</p> : (
          <>
            <div className="mt-6 space-y-3">
              {cart.map((it) => (
                <div key={`${it.product.id}-${it.variant}`} className="glass-card rounded-2xl p-3 flex gap-3">
                  <img src={it.product.image} alt={it.product.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{it.product.name}</p>
                    {it.variant && <p className="text-xs text-[var(--muted-foreground)]">{it.variant}</p>}
                    <p className="text-sm font-bold text-[var(--primary)]">{formatPrice(it.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(it.product.id, it.variant, it.quantity - 1)} className="w-7 h-7 rounded-full border bg-[var(--card)] flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-bold w-6 text-center">{it.quantity}</span>
                      <button onClick={() => updateQuantity(it.product.id, it.variant, it.quantity + 1)} className="w-7 h-7 rounded-full border bg-[var(--card)] flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                      <button onClick={() => removeFromCart(it.product.id, it.variant)} className="ml-auto text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 glass-card rounded-2xl p-4 flex justify-between font-bold text-lg"><span>{t.total}</span><span className="text-[var(--primary)]">{formatPrice(cartTotal)}</span></div>
            <Link href="/checkout" className="block mt-4"><Button size="lg" className="w-full">{t.checkout}</Button></Link>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
