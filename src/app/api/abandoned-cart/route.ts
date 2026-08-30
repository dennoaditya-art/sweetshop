import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const { email, items, total } = await request.json()
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

    const abandoned = await prisma.abandonedCart.create({
      data: {
        email,
        items: JSON.stringify(items ?? []),
        total: total ?? 0,
      },
    })

    return NextResponse.json({ ok: true, id: abandoned.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to save abandoned cart" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "10", 10) || 10, 1), 20)
    const abandoned = await prisma.abandonedCart.findMany({
      where: { recovered: false },
      take: limit,
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ abandoned })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to fetch abandoned carts" }, { status: 500 })
  }
}