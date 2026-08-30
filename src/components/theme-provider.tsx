"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "sweetshop-theme"

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return
  const resolved = theme === "system" ? getSystemTheme() : theme
  const root = document.documentElement
  if (resolved === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system"
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  return stored ?? "system"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    const initial = getInitialTheme()
    return initial === "system" ? getSystemTheme() : (initial as "light" | "dark")
  })

  useEffect(() => {
    applyTheme(theme)
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      if (theme === "system") {
        const next = getSystemTheme()
        setResolvedTheme(next)
        applyTheme("system")
      }
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [theme])

  const setTheme = (next: Theme) => {
    setThemeState(next)
    setResolvedTheme(next === "system" ? getSystemTheme() : next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
    applyTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}