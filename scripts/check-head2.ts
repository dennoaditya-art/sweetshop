import { PrismaClient } from "../src/generated/prisma/client.js"
import { PrismaLibSql } from "@prisma/adapter-libsql"
async function q(url: string, id: string){
  const a = new PrismaLibSql({url})
  const p = new PrismaClient({adapter: a} as any)
  const o = await p.order.findUnique({where:{id}})
  console.log(url, o ? 'FOUND '+o.customerPhone : 'NOT FOUND')
  await (p as any).$disconnect()
}
async function main(){
  await q('file:C:/Users/melki/AppData/Local/Temp/opencode/head.db', 'cmtfwdbup0001h4uumxqjh6rn')
  await q('file:./prisma/dev.db', 'cmtfwdbup0001h4uumxqjh6rn')
}
main()
