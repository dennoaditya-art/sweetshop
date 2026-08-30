/**
 * Payment adapter config — international-ready.
 * mock = instant success (global demo & COD), midtrans = Indonesia, stripe = stub.
 */
export type PaymentProvider = "mock" | "midtrans" | "stripe"

export const paymentConfig = {
  provider: (process.env.PAYMENT_PROVIDER as PaymentProvider) || "mock",
  currency: process.env.PAYMENT_CURRENCY || process.env.NEXT_PUBLIC_SITE_CURRENCY || "USD",
  codEnabled: process.env.COD_ENABLED !== "false", // default true for international
  stripe: {
    webhookKey: process.env.STRIPE_WEBHOOK_KEY ?? "",
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  },
  midtrans: {
    serverKey: process.env.MIDTRANS_SERVER_KEY ?? "",
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "",
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  },
} as const

export const paymentLabels: Record<PaymentProvider, string> = {
  mock: "Place Order",
  midtrans: "Pay via Midtrans",
  stripe: "Pay via Stripe",
}
