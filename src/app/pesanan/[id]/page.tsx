import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { formatPrice } from "@/lib/utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function PesananPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
  if (!order) notFound()
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mx-auto max-w-2xl px-4 py-8 w-full">
        <div className="glass-card rounded-[2rem] p-6 space-y-4">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Pesanan #{order.id.slice(0, 8)}</h1>
          <div className="flex gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[var(--muted)] border border-[var(--border)]">Status: {order.status}</span>
            <span className={`px-3 py-1 rounded-full border ${order.paymentStatus === "paid" ? "bg-green-100 border-green-200 text-green-700" : "bg-amber-100 border-amber-200 text-amber-700"}`}>Bayar: {order.paymentStatus}</span>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-[var(--muted-foreground)]">Nama:</span> {order.customerName}</p>
            <p><span className="text-[var(--muted-foreground)]">HP:</span> {order.customerPhone}</p>
            <p><span className="text-[var(--muted-foreground)]">Alamat:</span> {order.customerAddress}</p>
          </div>
          <div className="border-t border-[var(--border)] pt-4 space-y-2">
            {order.items.map((it) => (
              <div key={it.id} className="flex gap-3 text-sm">
                <img src={it.image} alt={it.productName} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1"><p className="font-semibold">{it.productName} {it.variant ? `(${it.variant})` : ""}</p><p className="text-xs text-[var(--muted-foreground)]">×{it.quantity} · {formatPrice(it.productPrice)}</p></div>
                <p className="font-bold">{formatPrice(it.productPrice * it.quantity)}</p>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg border-t border-[var(--border)] pt-3"><span>Total</span><span className="text-[var(--primary)]">{formatPrice(order.total)}</span></div>
          </div>
          <div className="flex gap-2">
            <Link href="/menu"><Button variant="outline">Belanja lagi</Button></Link>
            <Link href="/"><Button>Ke Beranda</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
