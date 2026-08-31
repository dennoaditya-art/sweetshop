import { PrismaClient } from "../src/generated/prisma/client.js"
import { PrismaLibSql } from "@prisma/adapter-libsql"
async function main(){
  const a=new PrismaLibSql({url:"file:./prisma/dev.db"})
  const p=new PrismaClient({adapter:a} as any)
  const orders=await p.order.findMany({orderBy:{createdAt:"desc"}, take:10})
  for(const o of orders) console.log(o.id, o.customerPhone, o.total, o.status, o.createdAt.toISOString())
  await (p as any).$disconnect()
}
main()
