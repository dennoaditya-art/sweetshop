import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

export async function GET() {
  const rows = await (prisma as any).siteConfig.findMany()
  const map = Object.fromEntries(rows.map((r: any) => [r.key, r.value]))
  return NextResponse.json({ config: map })
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json()
  const allowed = ["siteName", "siteTagline", "siteDescription", "footerText", "contactEmail"]
  for (const key of allowed) {
    if (typeof body[key] === "string") {
      await (prisma as any).siteConfig.upsert({
        where: { key },
        update: { value: body[key] },
        create: { key, value: body[key] },
      })
    }
  }
  const rows = await (prisma as any).siteConfig.findMany()
  return NextResponse.json({ ok: true, config: Object.fromEntries(rows.map((r: any) => [r.key, r.value])) })
}
