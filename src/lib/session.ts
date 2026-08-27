import { cookies } from "next/headers"
import { decrypt, encrypt } from "./crypto"

const SESSION_KEY = "sweetshop-session"

export interface SessionPayload {
  userId: string
  username: string
  role: string
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_KEY)?.value
  if (!sessionCookie) return null
  try {
    return await decrypt<SessionPayload>(sessionCookie)
  } catch {
    return null
  }
}

export async function setSession(payload: SessionPayload) {
  const cookieStore = await cookies()
  const encrypted = await encrypt(payload)
  cookieStore.set(SESSION_KEY, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_KEY, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}
