"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { paymentLabels, paymentConfig } from "@/config/payment"

declare global { interface Window { snap?: { pay: (token: string, opts: any) => void } } }

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" })

  function getPrice(it: (typeof cart)[number]) {
    if (it.variant && it.product.variants?.length) {
      const v = it.product.variants.find((x) => x.name === it.variant)
      if (v) return v.price
    }
    return it.product.price
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (cart.length === 0) return alert("Cart is empty")
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, customer: { name: form.name, phone: form.phone, address: form.address, notes: form.notes } }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // create snap token
      const tokenRes = await fetch("/api/payment/create-token", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.order.id }),
      })
      const tokenData = await tokenRes.json()
      if (!tokenRes.ok) throw new Error(tokenData.error)

      if (tokenData.isMock) {
        // mock: langsung anggap sukses
        clearCart()
        router.push(`/pesanan/${data.order.id}`)
        return
      }

      // load snap.js if needed
      if (!window.snap) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script")
          s.src = "https://app.sandbox.midtrans.com/snap/snap.js"
          s.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "")
          s.onload = () => resolve()
          s.onerror = () => reject(new Error("Gagal load Midtrans"))
          document.body.appendChild(s)
        })
      }
      window.snap!.pay(tokenData.snapToken, {
        onSuccess: () => { clearCart(); router.push(`/pesanan/${data.order.id}`) },
        onPending: () => { clearCart(); router.push(`/pesanan/${data.order.id}`) },
        onError: () => alert("Payment failed"),
        onClose: () => router.push(`/pesanan/${data.order.id}`),
      })
    } catch (err: any) { alert(err.message ?? "Checkout failed") } finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-8 w-full">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Checkout</h1>
        {cart.length === 0 ? <p className="text-sm text-[var(--muted-foreground)] mt-4">Cart is empty. <a href="/menu" className="text-[var(--primary)] underline">Shop now</a></p> : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h2 className="font-semibold">Order Summary</h2>
              {cart.map((it) => <div key={`${it.product.id}-${it.variant}`} className="flex justify-between text-sm"><span>{it.product.name} {it.variant ? `(${it.variant})` : ""} ×{it.quantity}</span><span className="font-bold">{formatPrice(getPrice(it) * it.quantity)}</span></div>)}
              <div className="flex justify-between font-bold border-t border-[var(--border)] pt-3"><span>Total</span><span className="text-[var(--primary)]">{formatPrice(cartTotal)}</span></div>
            </div>
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h2 className="font-semibold">Shipping Details</h2>
              <Input placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Phone / WhatsApp" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Textarea placeholder="Full address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Textarea placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Processing..." : paymentLabels[paymentConfig.provider] ?? "Place Order"}</Button>
            <p className="text-xs text-center text-[var(--muted-foreground)]">Mock mode: no real payment — order is marked paid instantly. Set PAYMENT_PROVIDER=midtrans/stripe for real gateway.</p>
          </form>
        )}
      </main>
      <Footer />
    </div>
  )
}
