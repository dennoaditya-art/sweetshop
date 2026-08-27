export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
        <p className="text-sm text-[var(--muted-foreground)]">Memuat...</p>
      </div>
    </div>
  )
}
