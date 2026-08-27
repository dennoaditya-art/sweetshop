import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { setSession } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    if (!username || !password) return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
    await setSession({ userId: user.id, username: user.username, role: user.role })
    return NextResponse.json({ user: { id: user.id, username: user.username, name: user.name, role: user.role } })
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
