import { Sparkles } from "lucide-react"
import { siteConfig } from "@/config/site"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #FFF9F5 0%, #FFF0E6 60%, #FFE6EF 100%)" }}>
      {/* header skeleton */}
      <div className="h-16 border-b border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl flex items-center px-4">
        <div className="mx-auto max-w-6xl w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[var(--primary)]/20 animate-pulse" />
            <div className="h-4 w-28 bg-[var(--muted)] rounded-full animate-pulse" />
          </div>
          <div className="hidden md:flex gap-6">
            <div className="h-3 w-12 bg-[var(--muted)] rounded-full animate-pulse" />
            <div className="h-3 w-14 bg-[var(--muted)] rounded-full animate-pulse" />
            <div className="h-3 w-12 bg-[var(--muted)] rounded-full animate-pulse" />
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--muted)] animate-pulse" />
        </div>
      </div>

      {/* center premium card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="glass-card rounded-[2rem] p-8 sm:p-10 flex flex-col items-center gap-6 max-w-sm w-full text-center shadow-xl">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full rhinestone animate-ping opacity-75" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full rhinestone animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>

          <div className="space-y-1">
            <p className="font-bold text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{siteConfig.name}</p>
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--muted-foreground)]">{siteConfig.tagline}</p>
          </div>

          <div className="flex flex-col items-center gap-4 w-full py-2">
            <div className="w-10 h-10 rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary)] animate-spin" aria-hidden />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]/60 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-sm font-medium text-[var(--muted-foreground)]">Memuat pengalaman manis...</p>
          </div>

          {/* shimmer progress */}
          <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden p-0.5">
            <div className="h-full w-1/2 bg-[var(--primary)] rounded-full animate-[shimmer_1.2s_ease-in-out_infinite]" style={{ animation: "shimmer 1.2s ease-in-out infinite" }} />
          </div>
          <p className="text-[10px] tracking-widest uppercase text-[var(--muted-foreground)]">SweetShop • Artisan • Fresh</p>
        </div>
      </div>

      {/* bottom skeleton grid hint */}
      <div className="mx-auto max-w-6xl px-4 pb-8 w-full hidden sm:block">
        <div className="grid grid-cols-4 gap-4 opacity-40">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-3 space-y-3">
              <div className="aspect-square bg-[var(--muted)] rounded-xl animate-pulse" />
              <div className="h-3 bg-[var(--muted)] rounded-full w-3/4 animate-pulse" />
              <div className="h-2 bg-[var(--muted)] rounded-full w-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } } @media (prefers-reduced-motion: reduce) { .animate-spin, .animate-pulse, .animate-bounce, [style*="shimmer"] { animation: none !important; } }`}</style>
    </div>
  )
}
