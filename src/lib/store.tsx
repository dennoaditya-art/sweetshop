"use client"

import { createContext, useContext, useReducer, useEffect, useCallback, useState, type ReactNode } from "react"
import type { CartItem, Product } from "@/types"

const CART_KEY = "sweetshop-cart"

type CartAction =
  | { type: "ADD_ITEM"; product: Product; variant?: string; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string; variant?: string }
  | { type: "UPDATE_QUANTITY"; productId: string; variant?: string; quantity: number }
  | { type: "CLEAR_CART" }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.findIndex(
        (item) =>
          item.product.id === action.product.id &&
          (action.variant ? item.variant === action.variant : !item.variant)
      )
      if (existingIndex >= 0) {
        const updated = [...state]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (action.quantity || 1),
        }
        return updated
      }
      return [
        ...state,
        { product: action.product, variant: action.variant, quantity: action.quantity || 1 },
      ]
    }
    case "REMOVE_ITEM":
      return state.filter(
        (item) => !(item.product.id === action.productId && item.variant === action.variant)
      )
    case "UPDATE_QUANTITY":
      if (action.quantity < 1) {
        return state.filter(
          (item) => !(item.product.id === action.productId && item.variant === action.variant)
        )
      }
      return state.map((item) =>
        item.product.id === action.productId && item.variant === action.variant
          ? { ...item, quantity: action.quantity }
          : item
      )
    case "CLEAR_CART":
      return []
    default:
      return state
  }
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

interface StoreContextValue {
  cart: CartItem[]
  addToCart: (product: Product, variant?: string, quantity?: number) => void
  removeFromCart: (productId: string, variant?: string) => void
  updateQuantity: (productId: string, variant: string | undefined, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, cartDispatch] = useReducer(cartReducer, [], () => loadFromStorage<CartItem[]>(CART_KEY, []))
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch {}
  }, [cart])

  const addToCart = useCallback((product: Product, variant?: string, quantity?: number) => {
    if (!product?.id || typeof product.price !== "number" || Number.isNaN(product.price)) return
    const qty = Math.max(1, Math.floor(quantity ?? 1))
    cartDispatch({ type: "ADD_ITEM", product, variant, quantity: qty })
  }, [])

  const removeFromCart = useCallback((productId: string, variant?: string) => {
    cartDispatch({ type: "REMOVE_ITEM", productId, variant })
  }, [])

  const updateQuantity = useCallback((productId: string, variant: string | undefined, quantity: number) => {
    cartDispatch({ type: "UPDATE_QUANTITY", productId, variant, quantity })
  }, [])

  const clearCart = useCallback(() => {
    cartDispatch({ type: "CLEAR_CART" })
  }, [])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen((v) => !v), [])

  function getItemPrice(item: CartItem): number {
    if (item.variant && item.product.variants?.length) {
      const v = item.product.variants.find((x) => x.name === item.variant)
      if (v) return v.price
    }
    return item.product.price
  }
  const cartTotal = cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <StoreContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isCartOpen, openCart, closeCart, toggleCart }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error("useStore must be used within StoreProvider")
  return context
}
