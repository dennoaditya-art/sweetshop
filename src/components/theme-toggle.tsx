"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  const isDark = resolvedTheme === "dark"
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center justify-center hover:shadow-md transition-shadow"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      suppressHydrationWarning
    >
      {mounted && (isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
    </button>
  )
}
