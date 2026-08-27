import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } })
  return NextResponse.json({ orders })
}
