import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
  if (!order) return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 })
  return NextResponse.json({ order })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const order = await prisma.order.update({
    where: { id },
    data: {
      status: body.status,
      paymentStatus: body.paymentStatus,
      note: body.note,
      paidAt: body.paymentStatus === "paid" ? new Date() : undefined,
    },
    include: { items: true },
  })
  return NextResponse.json({ order })
}
