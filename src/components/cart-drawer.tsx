"use client"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useStore()
  function getPrice(item: (typeof cart)[number]) {
    if (item.variant && item.product.variants?.length) {
      const v = item.product.variants.find((x) => x.name === item.variant)
      if (v) return v.price
    }
    return item.product.price
  }
  if (!isCartOpen) return null
  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div onClick={closeCart} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl animate-in">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="font-bold flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Cart ({cart.length})</h2>
          <button onClick={closeCart} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-[var(--muted)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 && <p className="text-center text-sm text-[var(--muted-foreground)] py-12">Cart is empty — pick a favorite flavor!</p>}
          {cart.map((item) => (
            <div key={`${item.product.id}-${item.variant ?? ""}`} className="flex gap-3 p-3 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50">
              <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{item.product.name}</p>
                {item.variant && <p className="text-xs text-[var(--muted-foreground)]">{item.variant}</p>}
                <p className="text-sm font-bold text-[var(--primary)]">{formatPrice(getPrice(item))} × {item.quantity} = {formatPrice(getPrice(item) * item.quantity)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => updateQuantity(item.product.id, item.variant, item.quantity - 1)} className="w-7 h-7 rounded-full border bg-white flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.variant, item.quantity + 1)} className="w-7 h-7 rounded-full border bg-white flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                  <button onClick={() => removeFromCart(item.product.id, item.variant)} className="ml-auto text-xs text-red-500 hover:underline">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="p-4 border-t border-[var(--border)] space-y-3 bg-white">
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-[var(--primary)]">{formatPrice(cartTotal)}</span></div>
            <Link href="/checkout" onClick={closeCart} className="block"><Button className="w-full" size="lg">Checkout</Button></Link>
            <button onClick={closeCart} className="w-full text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Continue shopping</button>
          </div>
        )}
      </div>
    </div>
  )
}
