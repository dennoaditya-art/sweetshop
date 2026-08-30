import { PrismaClient } from "@/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { existsSync, copyFileSync, mkdirSync } from "fs"
import path from "path"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db"
  // ponytail: Vercel filesystem read-only — copy file DB to /tmp writable
  if (process.env.VERCEL && raw.startsWith("file:")) {
    const tmpPath = "/tmp/dev.db"
    const tmpUrl = `file:${tmpPath}`
    try {
      if (!existsSync(tmpPath)) {
        // source is bundled at ./prisma/dev.db (read-only), copy to /tmp
        const src = path.join(process.cwd(), "prisma", "dev.db")
        if (existsSync(src)) {
          mkdirSync(path.dirname(tmpPath), { recursive: true })
          copyFileSync(src, tmpPath)
        }
      }
    } catch {}
    return tmpUrl
  }
  return raw
}

function createPrismaClient() {
  const adapter = new PrismaLibSql({
    url: getDatabaseUrl(),
    authToken: process.env.DATABASE_AUTH_TOKEN,
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
