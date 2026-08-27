import type { Product } from "@/types"

export function parseProduct<T extends { images: string; tags: string; variants: string }>(p: T): Omit<T, "images" | "tags" | "variants"> & { images: string[]; tags: string[]; variants: Product["variants"] } {
  return {
    ...p,
    images: safeParse<string[]>(p.images, []),
    tags: safeParse<string[]>(p.tags, []),
    variants: safeParse<Product["variants"]>(p.variants, []),
  } as unknown as Omit<T, "images" | "tags" | "variants"> & { images: string[]; tags: string[]; variants: Product["variants"] }
}

function safeParse<T>(raw: string, fallback: T): T {
  try {
    const v = JSON.parse(raw)
    return v as T
  } catch {
    return fallback
  }
}
