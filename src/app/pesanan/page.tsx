import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function PesananIndex({ searchParams }: { searchParams?: Promise<{ id?: string, phone?: string }> }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mx-auto max-w-xl px-4 py-12 w-full">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Lacak Pesanan</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-2">Masukkan ID pesanan dan HP untuk melihat detail. Link pesanan ada di halaman sukses setelah checkout.</p>
        <form action="/pesanan/redirect" method="GET" className="mt-6 space-y-3 glass-card rounded-2xl p-4">
          <Input name="id" placeholder="ID Pesanan (8 karakter)" required pattern="[0-9a-zA-Z]{8,}" />
          <Input name="phone" placeholder="HP (08...)" required inputMode="tel" />
          <Button type="submit" className="w-full">Lihat Pesanan</Button>
        </form>
        <div className="mt-6 text-center flex gap-2 justify-center">
          <Link href="/menu"><Button variant="outline">Belanja</Button></Link>
          <Link href="/"><Button>Ke Beranda</Button></Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
