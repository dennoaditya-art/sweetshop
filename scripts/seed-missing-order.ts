import { PrismaClient } from "../src/generated/prisma/client.js"
import { PrismaLibSql } from "@prisma/adapter-libsql"
async function main(){
  const adapter = new PrismaLibSql({url:"file:./prisma/dev.db"})
  const prisma = new PrismaClient({adapter} as any)
  const id="cmtfxs29t000104kyia4fo8ob"
  const existing = await prisma.order.findUnique({where:{id}})
  if(existing){ console.log("already exists", id); await (prisma as any).$disconnect(); return }
  const product = await prisma.product.findFirst()
  if(!product){ console.log("no product"); return}
  const order = await prisma.order.create({
    data:{
      id,
      customerName:"denno",
      customerPhone:"12345678",
      customerAddress:"solo",
      customerNotes:"Email: deno@gmail.com",
      total: product.price,
      status:"baru",
      paymentStatus:"pending",
      items:{create:[{productId: product.id, productName: product.name, productPrice: product.price, quantity:1, image: product.image}]}
    },
    include:{items:true}
  })
  console.log("created", order.id, order.customerPhone)
  await (prisma as any).$disconnect()
}
main()
