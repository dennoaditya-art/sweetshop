import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = process.env.NEXT_PUBLIC_SITE_CURRENCY || "USD", locale: string = process.env.NEXT_PUBLIC_SITE_LOCALE || "en"): string {
  const cur = currency.toUpperCase()
  // IDR historically without decimals in this shop
  if (cur === "IDR") return `Rp${price.toLocaleString("id-ID")}`
  try {
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", { style: "currency", currency: cur, maximumFractionDigits: cur === "JPY" || cur === "IDR" ? 0 : 2 }).format(price)
  } catch {
    return `${cur} ${price.toLocaleString(locale === "id" ? "id-ID" : "en-US")}`
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}
