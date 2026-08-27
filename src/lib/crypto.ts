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

async function getKey(): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET.padEnd(32, "!").slice(0, 32)),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  )
  return keyMaterial
}

export async function encrypt<T>(payload: T): Promise<string> {
  const key = await getKey()
  const iv = crypto.getRandomValues(new Uint8Array(16))
  const encoded = encoder.encode(JSON.stringify(payload))
  const encrypted = await crypto.subtle.encrypt({ name: "AES-CBC", iv }, key, encoded)
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  return btoa(String.fromCharCode(...combined))
}

export async function decrypt<T>(token: string): Promise<T> {
  const key = await getKey()
  const combined = Uint8Array.from(atob(token), (c) => c.charCodeAt(0))
  const iv = combined.slice(0, 16)
  const data = combined.slice(16)
  const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data)
  return JSON.parse(decoder.decode(decrypted)) as T
}
