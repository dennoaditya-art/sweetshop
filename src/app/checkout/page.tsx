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
import { useDict } from "@/hooks/use-dict"
import { siteConfig } from "@/config/site"
import { Mail } from "lucide-react"

declare global { interface Window { snap?: { pay: (token: string, opts: any) => void } } }

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "", email: "" })
  const [hasSavedEmail, setHasSavedEmail] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [submitError, setSubmitError] = useState("")
  const t = useDict(siteConfig.locale)

  function validate(): boolean {
    const e: Record<string,string> = {}
    if (!form.name.trim()) e.name = "Nama wajib diisi"
    if (!form.phone.trim()) e.phone = "HP wajib diisi"
    else if (!/^\+?[0-9\s\-()]{8,20}$/.test(form.phone.trim())) e.phone = "Format HP tidak valid"
    if (!form.address.trim()) e.address = "Alamat wajib diisi"
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email tidak valid"
    setErrors(e)
    return Object.keys(e).length===0
  }

  function getPrice(it: (typeof cart)[number]) {
    if (it.variant && it.product.variants?.length) {
      const v = it.product.variants.find((x) => x.name === it.variant)
      if (v) return v.price
    }
    return it.product.price
  }

  // Save abandoned cart with email for potential recovery
  async function saveAbandonedCart(email: string) {
    try {
      await fetch("/api/abandoned-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, items: cart.map(it => ({ product: it.product.name, variant: it.variant, quantity: it.quantity })), total: cartTotal }),
      })
    } catch (e) {
      console.error("Failed to save abandoned cart:", e)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError("")
    if (cart.length === 0) { setSubmitError(t.cartEmpty); return }
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, customer: { name: form.name, phone: form.phone, address: form.address, notes: form.notes, email: form.email } }),
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
        // ponytail: simpan ke localStorage sebagai fallback jika Vercel DB ephemeral (file: di /tmp)
        try {
          const toStore = { ...data.order, customerPhone: form.phone, customerName: form.name, customerAddress: form.address, customerNotes: form.notes }
          localStorage.setItem("sweetshop_last_order", JSON.stringify(toStore))
          sessionStorage.setItem("sweetshop_last_order", JSON.stringify(toStore))
        } catch {}
        // mock: langsung anggap sukses — sertakan paid=1 agar badge Lunas
        clearCart()
        router.push(`/pesanan/${data.order.id}?phone=${encodeURIComponent(form.phone)}&paid=1`)
        return
      }

      if (tokenData.provider === "stripe" && tokenData.url) {
        // Stripe Checkout — redirect to Stripe hosted page
        clearCart()
        window.location.href = tokenData.url
        return
      }

      // load snap.js if needed (Midtrans)
      if (!window.snap) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script")
          s.src = paymentConfig.midtrans.isProduction ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js"
          s.setAttribute("data-client-key", paymentConfig.midtrans.clientKey ?? "")
          s.onload = () => resolve()
          s.onerror = () => reject(new Error("Gagal load Midtrans"))
          document.body.appendChild(s)
        })
      }
      // simpan juga untuk Midtrans agar fallback tetap ada
      try {
        const toStore = { ...data.order, customerPhone: form.phone, customerName: form.name, customerAddress: form.address }
        localStorage.setItem("sweetshop_last_order", JSON.stringify(toStore))
        sessionStorage.setItem("sweetshop_last_order", JSON.stringify(toStore))
      } catch {}
      window.snap!.pay(tokenData.snapToken, {
        onSuccess: () => { clearCart(); router.push(`/pesanan/${data.order.id}?phone=${encodeURIComponent(form.phone)}`) },
        onPending: () => { clearCart(); router.push(`/pesanan/${data.order.id}?phone=${encodeURIComponent(form.phone)}`) },
        onError: () => setSubmitError(t.genericError),
        onClose: () => router.push(`/pesanan/${data.order.id}?phone=${encodeURIComponent(form.phone)}`),
      })
    } catch (err: any) { setSubmitError(err.message ?? t.genericError) } finally { setLoading(false) }
  }

  // Save abandoned cart when user enters email
  const handleEmailBlur = () => {
    if (form.email && !hasSavedEmail && cart.length > 0) {
      saveAbandonedCart(form.email)
      setHasSavedEmail(true)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-8 w-full">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{t.checkoutTitle}</h1>
        {cart.length === 0 ? <p className="text-sm text-[var(--muted-foreground)] mt-4">{t.cartEmpty} <a href="/menu" className="text-[var(--primary)] underline">{t.cartEmptyLink}</a></p> : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h2 className="font-semibold">{t.orderSummary}</h2>
              {cart.map((it) => <div key={`${it.product.id}-${it.variant}`} className="flex justify-between text-sm"><span>{it.product.name} {it.variant ? `(${it.variant})` : ""} ×{it.quantity}</span><span className="font-bold">{formatPrice(getPrice(it) * it.quantity)}</span></div>)}
              <div className="flex justify-between font-bold border-t border-[var(--border)] pt-3"><span>{t.total}</span><span className="text-[var(--primary)]">{formatPrice(cartTotal)}</span></div>
            </div>
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h2 className="font-semibold">{t.shippingDetails}</h2>
              <div>
                <Input placeholder={t.fullName} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} autoComplete="name" />
                {errors.name && <p id="err-name" className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <Input placeholder={t.phone} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "err-phone" : undefined} autoComplete="tel" inputMode="tel" />
                {errors.phone && <p id="err-phone" className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email (for order updates)"
                  value={form.email}
                  onBlur={handleEmailBlur}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} autoComplete="email" inputMode="email"
                />
                {errors.email && <p id="err-email" className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <Textarea placeholder={t.address} required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} aria-invalid={!!errors.address} aria-describedby={errors.address ? "err-address" : undefined} autoComplete="street-address" />
                {errors.address && <p id="err-address" className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
              <Textarea placeholder={t.notes} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} aria-label="Catatan pesanan" />
            </div>
            {submitError && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{submitError}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading} aria-busy={loading}>{loading ? t.processing : paymentLabels[paymentConfig.provider] ?? t.placeOrder}</Button>
            <p className="text-xs text-center text-[var(--muted-foreground)]">Mock mode: no real payment — order is marked paid instantly. Set PAYMENT_PROVIDER=midtrans/stripe for real gateway.</p>
          </form>
        )}
        <div className="mt-6 p-4 glass-card rounded-2xl">
          <p className="text-xs text-[var(--muted-foreground)] flex items-start gap-2">
            <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Enter your email to receive order updates. We&apos;ll also send you a reminder if you leave your cart behind.</span>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
