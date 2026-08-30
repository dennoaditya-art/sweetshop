import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { setSession } from "@/lib/session"

// ponytail: naive in-memory rate-limit (per-instance, no external dep) — 5 attempts / 15 min per IP
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const rec = loginAttempts.get(ip)
  if (!rec || now > rec.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return false
  }
  rec.count += 1
  return rec.count > 5
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
    if (isRateLimited(ip)) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 })
    const { username, password } = await request.json()
    if (!username || !password) return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
    await setSession({ userId: user.id, username: user.username, role: user.role })
    loginAttempts.delete(ip)
    return NextResponse.json({ user: { id: user.id, username: user.username, name: user.name, role: user.role } })
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
