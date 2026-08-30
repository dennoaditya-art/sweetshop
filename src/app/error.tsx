"use client"
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Ups, ada yang tidak beres</h2>
      <p className="text-sm text-[var(--muted-foreground)] mt-2 max-w-md">{error.message || "Coba muat ulang halaman."}</p>
      <button onClick={reset} className="mt-6 h-10 px-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold">Coba lagi</button>
    </div>
  )
}
