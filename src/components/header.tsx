"use client"
import Link from "next/link"
import { ShoppingBag, Sparkles, Menu, X } from "lucide-react"
import { useStore } from "@/lib/store"
import { useState, useEffect } from "react"
import { siteConfig } from "@/config/site"
import { useDict } from "@/hooks/use-dict"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const { cartCount, toggleCart } = useStore()
  const [open, setOpen] = useState(false)
  const [liveName, setLiveName] = useState(siteConfig.name)
  const [liveTagline, setLiveTagline] = useState(siteConfig.tagline)
  useEffect(() => {
    fetch("/api/site-config").then(r=>r.json()).then(d=> {
      if (d.config?.siteName) setLiveName(d.config.siteName)
      if (d.config?.siteTagline) setLiveTagline(d.config.siteTagline)
    }).catch(()=>{})
  }, [])
  const t = useDict(siteConfig.locale)
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--card)]/70 border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)]"><Sparkles className="w-5 h-5" /></span>
          <span className="font-display font-bold text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{liveName}</span>
          <span className="hidden sm:inline text-xs font-medium px-2 py-1 rounded-full bg-[var(--muted)] border border-[var(--border)]">{liveTagline}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--primary)] transition-colors">{item.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={toggleCart} aria-label={t.headerAriaCart} className="relative w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center hover:shadow-md transition-shadow">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px] font-bold flex items-center justify-center">{cartCount}</span>}
          </button>
          <button onClick={() => setOpen(!open)} aria-label={t.headerAriaMenu} className="md:hidden w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center justify-center">
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--card)] px-4 py-3 flex flex-col gap-3">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="font-medium">{item.label}</Link>
          ))}
        </div>
      )}
    </header>
  )
}
