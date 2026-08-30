"use client"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { siteConfig as defaultSiteConfig } from "@/config/site"
import type { Category } from "@/types"

type Tab = "orders" | "products" | "settings" | "abandoned"

export function AdminClient({
  products: initialProducts,
  categories,
  orders: initialOrders,
}: {
  products: any[]
  categories: Category[]
  orders: any[]
}) {
  const [tab, setTab] = useState<Tab>("orders")
  const [products, setProducts] = useState(initialProducts)
  const [orders, setOrders] = useState(initialOrders)
  const [q, setQ] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editing, setEditing] = useState<any | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [siteForm, setSiteForm] = useState<Record<string, string>>({
    siteName: String(defaultSiteConfig.name),
    siteTagline: String(defaultSiteConfig.tagline),
    siteDescription: String(defaultSiteConfig.description),
    footerText: String(defaultSiteConfig.footerText),
    contactEmail: String(defaultSiteConfig.contactEmail),
  })
  const [abandoned, setAbandoned] = useState<any[]>([])
  useEffect(() => {
    if (!showAdd) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setShowAdd(false); setEditing(null) } }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [showAdd])
  const router = useRouter()

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }
  async function updateOrder(id: string, patch: any) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    if (res.ok) {
      const { order } = await res.json()
      setOrders((prev) => prev.map((o) => (o.id === id ? order : o)))
    }
  }

  const [visibleCount, setVisibleCount] = useState(20)
  const filteredOrders = useMemo(() => {
    let r = orders
    if (statusFilter !== "all") r = r.filter((o) => o.status === statusFilter)
    if (q) {
      const qq = q.toLowerCase()
      r = r.filter(
        (o) =>
          o.customerName.toLowerCase().includes(qq) ||
          o.customerPhone.toLowerCase().includes(qq) ||
          o.id.toLowerCase().includes(qq)
      )
    }
    return r
  }, [orders, q, statusFilter])
  const visibleOrders = filteredOrders.slice(0, visibleCount)

  async function handleSaveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload: any = {
      name: String(fd.get("name") || "").trim(),
      slug: String(fd.get("slug") || "").trim(),
      description: String(fd.get("description") || "").trim(),
      price: Number(fd.get("price")),
      originalPrice: fd.get("originalPrice") ? Number(fd.get("originalPrice")) : undefined,
      image: String(fd.get("image") || "").trim(),
      categoryId: String(fd.get("categoryId") || "").trim(),
      stock: Number(fd.get("stock") || 0),
      rating: Number(fd.get("rating") || 0),
      variants: (() => {
        try {
          const raw = String(fd.get("variants") || "[]").trim()
          return raw ? JSON.parse(raw) : []
        } catch {
          return []
        }
      })(),
      isBestSeller: fd.get("isBestSeller") === "on",
      isNew: fd.get("isNew") === "on",
    }
    if (!payload.name || !payload.slug || !payload.image || !payload.categoryId) {
      alert("Name, slug, image, category required")
      return
    }
    setSaving(true)
    try {
      const isEdit = !!editing
      const url = isEdit ? `/api/products/${editing.id}` : "/api/products"
      const method = isEdit ? "PUT" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      if (isEdit) setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...data.product } : p)))
      else setProducts((prev) => [data.product, ...prev])
      setEditing(null)
      setShowAdd(false)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id))
    else alert("Failed to delete")
  }

  async function handleSaveSite(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/site-config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(siteForm) })
    setSaving(false)
    if (res.ok) alert("Settings saved — refresh to see changes (header/footer use config)")
    else alert("Failed to save")
  }

  async function loadAbandoned() {
    const res = await fetch("/api/abandoned-cart?limit=20")
    if (res.ok) { const d = await res.json(); setAbandoned(d.abandoned ?? []) }
  }

  return (
    <div className="min-h-screen bg-[var(--muted)]/30">
      <header className="sticky top-0 z-10 bg-[var(--card)] border-b border-[var(--border)] flex items-center justify-between px-4 h-14">
        <p className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
          {defaultSiteConfig.name} Admin
        </p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setTab("orders")} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${tab === "orders" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-[var(--card)]"}`}>Orders</button>
          <button onClick={() => setTab("products")} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${tab === "products" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-[var(--card)]"}`}>Products</button>
          <button onClick={() => { setTab("abandoned"); loadAbandoned() }} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${tab === "abandoned" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-[var(--card)]"}`}>Abandoned</button>
          <button onClick={() => setTab("settings")} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${tab === "settings" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-[var(--card)]"}`}>Settings</button>
          <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        {tab === "orders" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <h2 className="text-lg font-bold">Orders ({filteredOrders.length}/{orders.length})</h2>
              <div className="flex gap-2">
                <Input placeholder="Search name/phone/id" value={q} onChange={(e) => setQ(e.target.value)} className="h-8 w-44" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 text-xs">
                  <option value="all">All status</option>
                  <option value="baru">baru</option>
                  <option value="diproses">diproses</option>
                  <option value="selesai">selesai</option>
                  <option value="batal">batal</option>
                </select>
              </div>
            </div>
            {visibleOrders.map((o) => (
              <div key={o.id} className="glass-card rounded-2xl p-4 space-y-2">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-mono text-xs">#{o.id.slice(0, 8)} · {new Date(o.createdAt).toLocaleString("en-US")}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-[var(--muted)] border">{o.status} · {o.paymentStatus}</span>
                </div>
                <p className="text-sm"><b>{o.customerName}</b> — {o.customerPhone} — {o.customerAddress}</p>
                {o.customerNotes && <p className="text-xs text-[var(--muted-foreground)]">Note: {o.customerNotes}</p>}
                <div className="text-xs space-y-1">
                  {o.items.map((it: any) => (
                    <div key={it.id} className="flex justify-between"><span>{it.productName} {it.variant ? `(${it.variant})` : ""} ×{it.quantity}</span><span>{formatPrice(it.productPrice * it.quantity)}</span></div>
                  ))}
                </div>
                <p className="font-bold">Total {formatPrice(o.total)}</p>
                <div className="flex flex-wrap gap-2">
                  <select value={o.status} onChange={(e) => updateOrder(o.id, { status: e.target.value })} className="h-8 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 text-xs">
                    <option value="baru">baru</option><option value="diproses">diproses</option><option value="selesai">selesai</option><option value="batal">batal</option>
                  </select>
                  <select value={o.paymentStatus} onChange={(e) => updateOrder(o.id, { paymentStatus: e.target.value })} className="h-8 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 text-xs">
                    <option value="pending">pending</option><option value="paid">paid</option><option value="failed">failed</option>
                  </select>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && <p className="text-sm text-[var(--muted-foreground)] text-center py-8">No orders found.</p>}
            {visibleOrders.length < filteredOrders.length && <div className="text-center"><Button variant="outline" size="sm" onClick={()=> setVisibleCount(c=> c+20)}>Load more ({filteredOrders.length - visibleOrders.length} remaining)</Button></div>}
            {orders.length===100 && <p className="text-xs text-center text-[var(--muted-foreground)]">Showing latest 100 — add pagination via <code>skip/take</code> in <code>src/app/admin/page.tsx</code></p>}
          </div>
        )}

        {tab === "products" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Products ({products.length})</h2>
              <Button size="sm" onClick={() => { setEditing(null); setShowAdd(true) }}>+ Add Product</Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {products.map((p: any) => (
                <div key={p.id} className="glass-card rounded-2xl p-3 flex gap-3">
                  <img src={p.image} alt={p.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight">{p.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{p.category?.name ?? p.categoryId} · Stock {p.stock} {p.stock <= 5 && p.stock > 0 ? "⚠️ Low" : ""} {p.stock === 0 ? "❌ Out" : ""}</p>
                    <p className="text-sm font-bold text-[var(--primary)]">{formatPrice(p.price)}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => { setEditing(p); setShowAdd(true) }} className="text-xs px-3 py-1 rounded-full border bg-[var(--card)] hover:bg-[var(--muted)]">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1 rounded-full border bg-[var(--card)] text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showAdd && (
              <div className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={editing ? "Edit product" : "Add product"}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowAdd(false); setEditing(null) }} aria-hidden />
                <form onSubmit={handleSaveProduct} className="relative bg-[var(--card)] rounded-[1.5rem] p-6 w-full max-w-lg max-h-[90vh] overflow-auto space-y-3">
                  <h3 className="font-bold text-lg">{editing ? "Edit Product" : "Add Product"}</h3>
                  <Input name="name" placeholder="Name" defaultValue={editing?.name ?? ""} required autoFocus />
                  <Input name="slug" placeholder="slug-like-this" defaultValue={editing?.slug ?? ""} required />
                  <Textarea name="description" placeholder="Description" defaultValue={editing?.description ?? ""} required />
                  <div className="grid grid-cols-2 gap-2">
                    <Input name="price" type="number" placeholder="Price" defaultValue={editing?.price ?? ""} required />
                    <Input name="originalPrice" type="number" placeholder="Original price (optional)" defaultValue={editing?.originalPrice ?? ""} />
                  </div>
                  <Input name="image" placeholder="Image URL https://..." defaultValue={editing?.image ?? ""} required />
                  <div className="grid grid-cols-2 gap-2">
                    <select name="categoryId" defaultValue={editing?.categoryId ?? categories[0]?.id ?? ""} className="h-10 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 text-sm" required>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                    </select>
                    <Input name="stock" type="number" placeholder="Stock" defaultValue={editing?.stock ?? 10} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input name="rating" type="number" step="0.1" placeholder="Rating 0-5" defaultValue={editing?.rating ?? 4.8} />
                    <div className="flex items-center gap-3 text-sm">
                      <label className="flex items-center gap-1"><input type="checkbox" name="isBestSeller" defaultChecked={editing?.isBestSeller} /> Best seller</label>
                      <label className="flex items-center gap-1"><input type="checkbox" name="isNew" defaultChecked={editing?.isNew} /> New</label>
                    </div>
                  </div>
                  <Textarea name="variants" placeholder='Variants JSON e.g. [{"name":"1 Scoop","price":28000}]' defaultValue={editing ? JSON.stringify(editing.variants ?? []) : '[]'} />
                  <div className="flex gap-2 justify-end pt-2">
                    <Button type="button" variant="outline" onClick={() => { setShowAdd(false); setEditing(null) }}>Cancel</Button>
                    <Button type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Create"}</Button>
                  </div>
                  <p className="text-[10px] text-[var(--muted-foreground)]">Tip: image can be Unsplash URL. Slug must be unique.</p>
                </form>
              </div>
            )}
          </div>
        )}

        {tab === "abandoned" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center"><h2 className="text-lg font-bold">Abandoned Carts ({abandoned.length})</h2><Button size="sm" variant="outline" onClick={loadAbandoned}>Refresh</Button></div>
            <p className="text-xs text-[var(--muted-foreground)]">Tanpa domain: recovery manual via WA/Email. Dengan domain + RESEND_API_KEY: auto-email aktif. <a href={`data:text/csv;charset=utf-8,${encodeURIComponent("email,total,items,createdAt\n" + abandoned.map((a:any)=> `${a.email},${a.total},"${String(a.items).replace(/"/g,'""')}",${a.createdAt}`).join("\n"))}`} download="abandoned.csv" className="underline text-[var(--primary)]">Download CSV</a></p>
            {abandoned.map((a:any)=> (
              <div key={a.id} className="glass-card rounded-2xl p-4 flex flex-wrap justify-between gap-2">
                <div><p className="text-sm font-semibold">{a.email}</p><p className="text-xs text-[var(--muted-foreground)]">{new Date(a.createdAt).toLocaleString()} · {formatPrice(a.total)}</p><p className="text-xs mt-1 line-clamp-2">{String(a.items).slice(0,120)}</p></div>
                <div className="flex gap-2 self-start"><a href={`https://wa.me/?text=${encodeURIComponent(`Hi! You left ${String(a.items).slice(0,60)} in your cart — complete at ${defaultSiteConfig.siteUrl}`)}`} target="_blank" className="text-xs px-3 py-1 rounded-full border bg-[var(--card)] hover:bg-[var(--muted)]">WA</a><a href={`mailto:${a.email}?subject=${encodeURIComponent("You left something sweet 🍦")}&body=${encodeURIComponent(`Hi! Complete your order: ${defaultSiteConfig.siteUrl}/checkout`)}`} className="text-xs px-3 py-1 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">Email</a></div>
              </div>
            ))}
            {abandoned.length===0 && <p className="text-sm text-[var(--muted-foreground)] text-center py-8">No abandoned carts yet.</p>}
          </div>
        )}

        {tab === "settings" && (
          <form onSubmit={handleSaveSite} className="glass-card rounded-2xl p-6 space-y-4 max-w-xl">
            <h2 className="text-lg font-bold">White-label Settings</h2>
            <p className="text-xs text-[var(--muted-foreground)]">Changes saved to DB and used after refresh. Also editable via <code>src/config/site.ts</code> for permanent rebrand.</p>
            <Input placeholder="Site name" value={siteForm.siteName} onChange={(e) => setSiteForm({ ...siteForm, siteName: e.target.value })} />
            <Input placeholder="Tagline" value={siteForm.siteTagline} onChange={(e) => setSiteForm({ ...siteForm, siteTagline: e.target.value })} />
            <Textarea placeholder="Description (SEO)" value={siteForm.siteDescription} onChange={(e) => setSiteForm({ ...siteForm, siteDescription: e.target.value })} />
            <Input placeholder="Footer text" value={siteForm.footerText} onChange={(e) => setSiteForm({ ...siteForm, footerText: e.target.value })} />
            <Input placeholder="Contact email" value={siteForm.contactEmail} onChange={(e) => setSiteForm({ ...siteForm, contactEmail: e.target.value })} />
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
            <div className="pt-4 border-t border-[var(--border)] space-y-2">
              <h3 className="font-semibold text-sm">How to rebrand permanently</h3>
              <p className="text-xs text-[var(--muted-foreground)]">Edit <code>src/config/site.ts</code> (name, tagline, hero) and <code>src/config/theme.ts</code> (colors). Then redeploy. DB settings override file config at runtime.</p>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
