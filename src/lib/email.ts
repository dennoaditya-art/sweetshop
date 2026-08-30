// ponytail: email abstraction — works without domain (logs), auto-sends when RESEND_API_KEY+EMAIL_FROM set
export async function sendRecoveryEmail(to: string, items: string, total: number): Promise<{ sent: boolean; mocked?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from) {
    console.log(`[email mock] to=${to} total=${total} items=${items} — set RESEND_API_KEY+EMAIL_FROM to send real email`)
    return { sent: false, mocked: true }
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: "You left something sweet behind 🍦", html: `<p>Hi! You left <b>${items}</b> (total ${total}) in your cart. <a href="${process.env.NEXT_PUBLIC_SITE_URL}/checkout">Complete your order</a></p>` }),
    })
    if (!res.ok) throw new Error(await res.text())
    return { sent: true }
  } catch (e) {
    console.error("[email]", e)
    return { sent: false }
  }
}
