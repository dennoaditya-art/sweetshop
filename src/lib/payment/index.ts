import { paymentConfig, type PaymentProvider } from "@/config/payment"
import { siteConfig } from "@/config/site"

export interface CreateTokenInput {
  orderId: string
  total: number
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: { productId: string; productName: string; variant?: string | null; price: number; quantity: number }[]
}

export interface CreateTokenResult {
  snapToken: string
  midtransOrderId: string
  isMock: boolean
  provider: PaymentProvider
  url?: string
}

const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND", "IDR", "BIF", "CLP", "DJF", "GNF", "KMF", "MGA", "PYG", "RWF", "UGX", "VUV", "XAF", "XOF", "XPF"])

function toStripeAmount(amount: number, currency: string): number {
  const c = currency.toUpperCase()
  if (ZERO_DECIMAL.has(c)) return Math.round(amount)
  return Math.round(amount * 100)
}

export async function createPaymentToken(input: CreateTokenInput): Promise<CreateTokenResult> {
  const provider = paymentConfig.provider
  const midtransOrderId = `${input.orderId}-${Date.now()}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl

  // Stripe — real Checkout Session (international, no domain required beyond vercel.app)
  if (provider === "stripe") {
    const secretKey = process.env.STRIPE_SECRET_KEY ?? paymentConfig.stripe.secretKey
    if (!secretKey || secretKey.includes("dummy") || secretKey.includes("xxxxx")) {
      // No keys in dev → graceful mock, buyer sees real Stripe after setting keys
      return { snapToken: `mock-snap-${midtransOrderId}`, midtransOrderId, isMock: true, provider }
    }
    const { default: Stripe } = await import("stripe")
    const stripe = new Stripe(secretKey)
    const currency = (paymentConfig.currency || "USD").toLowerCase()
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/pesanan/${input.orderId}?phone=${encodeURIComponent(input.customerPhone)}&paid=1`,
      cancel_url: `${siteUrl}/checkout?canceled=1`,
      customer_email: input.customerEmail || undefined,
      line_items: input.items.map((it) => ({
        quantity: it.quantity,
        price_data: {
          currency,
          product_data: { name: it.productName + (it.variant ? ` (${it.variant})` : "") },
          unit_amount: toStripeAmount(it.price, currency),
        },
      })),
      metadata: { orderId: input.orderId, midtransOrderId },
      phone_number_collection: { enabled: false },
    })
    return { snapToken: session.id, midtransOrderId, isMock: false, provider: "stripe", url: session.url ?? undefined }
  }

  if (provider === "mock") {
    return { snapToken: `mock-snap-${midtransOrderId}`, midtransOrderId, isMock: true, provider }
  }

  // midtrans
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? ""
  if (!serverKey || serverKey.includes("dummy") || serverKey.includes("xxxxx")) {
    return { snapToken: `mock-snap-${midtransOrderId}`, midtransOrderId, isMock: true, provider: "mock" }
  }
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true"
  const snapUrl = isProduction ? "https://app.midtrans.com/snap/v1/transactions" : "https://app.sandbox.midtrans.com/snap/v1/transactions"
  const auth = Buffer.from(`${serverKey}:`).toString("base64")
  const payload = {
    transaction_details: { order_id: midtransOrderId, gross_amount: input.total },
    customer_details: { first_name: input.customerName, phone: input.customerPhone },
    item_details: input.items.map((it) => ({ id: it.productId, name: it.productName + (it.variant ? ` (${it.variant})` : ""), price: it.price, quantity: it.quantity })),
  }
  const res = await fetch(snapUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}`, Accept: "application/json" },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_messages ?? "Failed to create Midtrans token")
  return { snapToken: data.token, midtransOrderId, isMock: false, provider: "midtrans" }
}
