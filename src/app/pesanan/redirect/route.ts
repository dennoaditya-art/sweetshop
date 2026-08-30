import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawId = searchParams.get("id")?.trim()
  const phone = searchParams.get("phone")?.trim()
  if (!rawId) return NextResponse.redirect(new URL("/pesanan", request.url))
  let fullId = rawId
  // support short 8-char id
  if (rawId.length === 8) {
    const found = await prisma.order.findFirst({ where: { id: { startsWith: rawId } }, select: { id: true } })
    if (found) fullId = found.id
  }
  const target = new URL(`/pesanan/${fullId}`, request.url)
  if (phone) target.searchParams.set("phone", phone)
  return NextResponse.redirect(target)
}
