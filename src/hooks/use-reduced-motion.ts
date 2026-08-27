"use client"
import { useSyncExternalStore } from "react"
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)")
      m.addEventListener("change", cb)
      return () => m.removeEventListener("change", cb)
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  )
}
