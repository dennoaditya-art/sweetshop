import { PrismaClient } from "@/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { existsSync, copyFileSync, mkdirSync } from "fs"
import path from "path"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? process.env.TURSO_DATABASE_URL ?? "file:./prisma/dev.db"
  // ponytail: Vercel filesystem read-only — SQLite di Vercel ephemeral per-lambda, pesanan akan hilang antar-request.
  // Fix permanen: set DATABASE_URL=libsql://... + DATABASE_AUTH_TOKEN (Turso) di Vercel Env. Fallback file: hanya untuk dev.
  if (process.env.VERCEL && raw.startsWith("file:")) {
    console.warn("[prisma] WARNING: DATABASE_URL masih file: di Vercel — pesanan akan hilang (ephemeral /tmp). Set Turso libsql:// di Vercel Env.")
    const tmpPath = "/tmp/dev.db"
    const tmpUrl = `file:${tmpPath}`
    try {
      const src = path.join(process.cwd(), "prisma", "dev.db")
      if (existsSync(src) && !existsSync(tmpPath)) {
        mkdirSync(path.dirname(tmpPath), { recursive: true })
        // ponytail: hanya copy sekali per instance — jangan overwrite tiap request (order baru akan terhapus jika overwrite)
        copyFileSync(src, tmpPath)
      }
    } catch {}
    return tmpUrl
  }
  return raw
}

function createPrismaClient() {
  const adapter = new PrismaLibSql({
    url: getDatabaseUrl(),
    authToken: process.env.DATABASE_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN,
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
