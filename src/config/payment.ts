/**
 * Payment adapter config — international-ready.
 * mock = instant success (global demo & COD), midtrans = Indonesia, stripe = stub.
 */
export type PaymentProvider = "mock" | "midtrans" | "stripe"

export const paymentConfig = {
  provider: (process.env.PAYMENT_PROVIDER as PaymentProvider) || "mock",
  currency: process.env.PAYMENT_CURRENCY || process.env.NEXT_PUBLIC_SITE_CURRENCY || "USD",
  codEnabled: process.env.COD_ENABLED !== "false", // default true for international
} as const

export const paymentLabels: Record<PaymentProvider, string> = {
  mock: "Place Order",
  midtrans: "Pay via Midtrans",
  stripe: "Pay via Stripe",
}
