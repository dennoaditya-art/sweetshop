import { PrismaClient } from "../src/generated/prisma/client.js"
import { PrismaLibSql } from "@prisma/adapter-libsql"
async function main(){
  const a=new PrismaLibSql({url:"file:./prisma/dev.db"})
  const p=new PrismaClient({adapter:a} as any)
  const ids=["cmtfwdbup0001h4uumxqjh6rn","cmtfxs29t000104kyia4fo8ob"]
  for(const id of ids){
    const o=await p.order.findUnique({where:{id}, include:{items:true}})
    console.log(id, o ? "FOUND phone="+o.customerPhone+" total="+o.total : "NOT FOUND")
  }
  await (p as any).$disconnect()
}
main()
