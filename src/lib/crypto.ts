const encoder = new TextEncoder()
const decoder = new TextDecoder()

const rawSecret = process.env.SESSION_SECRET

if (!rawSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET required in production (min 32 chars)")
  }
  console.warn("[sweetshop] SESSION_SECRET tidak disetel — pakai secret acak dev.")
}
const SECRET: string = rawSecret || crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "")

// ponytail: SHA-256 hash gives 32-byte key without weak padEnd; AES-GCM provides auth tag (no padding oracle)
async function getKey(): Promise<CryptoKey> {
  const hashed = await crypto.subtle.digest("SHA-256", encoder.encode(SECRET))
  return crypto.subtle.importKey("raw", hashed, { name: "AES-GCM" }, false, ["encrypt", "decrypt"])
}

function b64urlEncode(buf: Uint8Array): string {
  const b64 = btoa(String.fromCharCode(...buf))
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}
function b64urlDecode(s: string): Uint8Array {
  let b64 = s.replace(/-/g, "+").replace(/_/g, "/")
  const pad = b64.length % 4
  if (pad) b64 += "=".repeat(4 - pad)
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

export async function encrypt<T>(payload: T): Promise<string> {
  const key = await getKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = encoder.encode(JSON.stringify(payload))
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded)
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  return b64urlEncode(combined)
}

export async function decrypt<T>(token: string): Promise<T> {
  const key = await getKey()
  const combined = b64urlDecode(token)
  const iv = combined.slice(0, 12)
  const data = combined.slice(12)
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data)
  return JSON.parse(decoder.decode(decrypted)) as T
}
