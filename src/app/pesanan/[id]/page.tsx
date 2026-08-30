import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { formatPrice } from "@/lib/utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"
import { CheckCircle, Package, Truck, MapPin, Phone, MessageCircle, Sparkles } from "lucide-react"
import { CopyButton } from "./copy-button"

export const dynamic = "force-dynamic"

export default async function PesananPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ phone?: string; paid?: string }> }) {
  const { id } = await params
  const { phone, paid } = (await searchParams) ?? {}
  const session = await getSession()
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
  if (!order) notFound()
  if (!session && phone !== order.customerPhone) notFound()
  const isPaid = order.paymentStatus === "paid" || paid === "1"
  const shortId = order.id.slice(0, 8).toUpperCase()

  return (
    <div className="flex flex-col min-h-screen">
      <Header /><CartDrawer />
      <main className="flex-1 mx-auto max-w-2xl px-4 py-8 w-full">
        {/* Success hero */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center shadow-lg" style={{ boxShadow: "0 8px 24px rgba(34,197,94,0.25)" }}>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mt-4" style={{ fontFamily: "var(--font-display)" }}>Pesanan Berhasil! 🎉</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 max-w-md mx-auto">
            {isPaid ? "Pembayaran kamu terkonfirmasi. Kami sedang siapkan es krim glossy-mu!" : "Terima kasih! Pesanan kamu sudah masuk — tim kami akan proses segera."}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-sm">
            <span className="text-[var(--muted-foreground)]">ID</span>
            <span className="font-mono font-bold tracking-widest">{shortId}</span>
            <span className="text-[var(--muted-foreground)]">•</span>
            <span className={`px-2 py-0.5 rounded-full text-xs border ${isPaid ? "bg-green-100 border-green-200 text-green-700" : "bg-amber-100 border-amber-200 text-amber-700"}`}>{isPaid ? "Lunas" : "Menunggu bayar"}</span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-2 flex items-center justify-center gap-1"><Sparkles className="w-3 h-3 text-[var(--primary)]" /> Simpan ID ini untuk lacak pesanan</p>
        </div>

        {/* Timeline */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            { label: "Diterima", active: true, icon: Package },
            { label: "Diproses", active: order.status !== "baru", icon: Truck },
            { label: "Selesai", active: order.status === "selesai", icon: CheckCircle },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${s.active ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]" : "bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)]"}`}>
              <s.icon className="w-3.5 h-3.5" /> {s.label}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[2rem] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2"><Package className="w-4 h-4 text-[var(--primary)]" /> Detail Pesanan</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-[var(--muted)] border">{order.status} • {order.paymentStatus}</span>
          </div>

          <div className="grid gap-3 text-sm p-3 rounded-2xl bg-[var(--muted)]/40 border border-[var(--border)]">
            <p className="flex gap-2"><span className="text-[var(--muted-foreground)] flex items-center gap-1"><Phone className="w-3 h-3" /> HP:</span> <span className="font-medium">{order.customerPhone}</span></p>
            <p className="flex gap-2"><span className="text-[var(--muted-foreground)]">Nama:</span> <span className="font-medium">{order.customerName}</span></p>
            <p className="flex gap-2"><span className="text-[var(--muted-foreground)] flex items-center gap-1"><MapPin className="w-3 h-3" /> Alamat:</span> <span>{order.customerAddress}</span></p>
            {order.customerNotes && <p className="text-xs text-[var(--muted-foreground)] border-t border-[var(--border)] pt-2">Catatan: {order.customerNotes}</p>}
          </div>

          <div className="space-y-2">
            {order.items.map((it) => (
              <div key={it.id} className="flex gap-3 text-sm p-2 rounded-xl hover:bg-[var(--muted)]/30 transition-colors">
                <img src={it.image} alt={it.productName} className="w-14 h-14 rounded-xl object-cover border border-[var(--border)]" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold leading-tight truncate">{it.productName} {it.variant ? `(${it.variant})` : ""}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">×{it.quantity} · {formatPrice(it.productPrice)}</p>
                </div>
                <p className="font-bold whitespace-nowrap">{formatPrice(it.productPrice * it.quantity)}</p>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg border-t border-[var(--border)] pt-3"><span>Total</span><span className="text-[var(--primary)]">{formatPrice(order.total)}</span></div>
            <p className="text-xs text-[var(--muted-foreground)] text-center">Pembayaran: {order.paymentStatus} • ID: {shortId} • {new Date(order.createdAt).toLocaleString("id-ID")}</p>
          </div>

          <div className="grid gap-2">
            <a href={`https://wa.me/?text=${encodeURIComponent(`Halo! Saya mau tanya pesanan ${shortId} — ${order.customerName}`)}`} target="_blank" className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">
              <MessageCircle className="w-4 h-4" /> Chat via WhatsApp
            </a>
            <div className="flex gap-2">
              <div className="flex-1"><CopyButton text={shortId} /></div>
              <Link href="/menu" className="flex-1"><Button variant="outline" className="w-full">Belanja lagi</Button></Link>
              <Link href="/" className="flex-1"><Button className="w-full">Ke Beranda</Button></Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--muted-foreground)] mt-6">Butuh bantuan? Hubungi {order.customerPhone ? "admin via WA di atas" : "support"} • Simpan link ini: <span className="font-mono">{`/pesanan/${shortId}`}</span></p>
      </main>
      <Footer />
    </div>
  )
}
