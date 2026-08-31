import { PrismaClient } from "../src/generated/prisma/client.js"
import { PrismaLibSql } from "@prisma/adapter-libsql"
async function main(){
  const adapter = new PrismaLibSql({url: "file:./prisma/dev.db"})
  const prisma = new PrismaClient({adapter} as any)
  const id='cmtfwdbup0001h4uumxqjh6rn'
  const o = await prisma.order.findUnique({where:{id}, include:{items:true}})
  if(!o) console.log('NOT FOUND')
  else console.log(JSON.stringify({id:o.id, phone:o.customerPhone, name:o.customerName, total:o.total, status:o.status, items:o.items.length, paymentStatus:o.paymentStatus}, null, 2))
  await (prisma as any).$disconnect()
}
main()
