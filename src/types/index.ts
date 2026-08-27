export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice: number | null
  image: string
  images: string[]
  categoryId: string
  category?: Category
  tags: string[]
  rating: number
  sold: number
  isBestSeller: boolean
  isNew: boolean
  stock: number
  variants: { name: string; price: number }[]
  createdAt?: string | Date
}

export interface Category {
  id: string
  name: string
  emoji: string
  description: string
}

export interface CartItem {
  product: Product
  variant?: string
  quantity: number
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productPrice: number
  variant?: string | null
  quantity: number
  image: string
}

export interface Order {
  id: string
  items: OrderItem[]
  customerName: string
  customerPhone: string
  customerAddress: string
  customerNotes?: string | null
  total: number
  status: string
  paymentStatus: string
  midtransOrderId?: string | null
  snapToken?: string | null
  paidAt?: string | Date | null
  createdAt: string | Date
}
