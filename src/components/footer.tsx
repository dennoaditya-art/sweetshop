import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row justify-between gap-4 text-sm">
        <div>
          <p className="font-bold" style={{ fontFamily: "var(--font-display)" }}>{siteConfig.name}</p>
          <p className="text-[var(--muted-foreground)]">{siteConfig.footerText}</p>
        </div>
        <p className="text-[var(--muted-foreground)]">© 2026 {siteConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  )
}
