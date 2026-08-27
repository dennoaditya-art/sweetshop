import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import bcrypt from "bcryptjs"

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" })
const prisma = new PrismaClient({ adapter })

const categories = [
  { id: "ice-cream", name: "Es Krim Scoop", emoji: "🍦", description: "Scoop es krim artisan aneka rasa" },
  { id: "sundae", name: "Sundae & Parfait", emoji: "🍨", description: "Sundae cantik dengan topping melimpah" },
  { id: "drink", name: "Minuman Manis", emoji: "🥤", description: "Milkshake & minuman segar" },
  { id: "dessert", name: "Dessert Box", emoji: "🍰", description: "Dessert box & panna cotta" },
  { id: "bundle", name: "Bundle Hemat", emoji: "🎀", description: "Paket bundling untuk berbagi" },
]

const products = [
  {
    id: "1", name: "Strawberry Glaze Scoop", slug: "strawberry-glaze-scoop",
    description: "Es krim strawberry dengan glaze mengkilap ala glazed donut nails — asam manis segar.",
    price: 28000, originalPrice: 35000,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80"],
    category: "ice-cream", tags: ["best-seller","strawberry","glaze"], rating: 4.9, sold: 892, isBestSeller: true, stock: 50,
    variants: JSON.stringify([{ name: "1 Scoop", price: 28000 },{ name: "2 Scoop", price: 48000 },{ name: "Pint 500ml", price: 89000 }]),
  },
  {
    id: "2", name: "Matcha Cloud Parfait", slug: "matcha-cloud-parfait",
    description: "Parfait matcha dengan awan whipped cream dan crumble pistachio.",
    price: 42000, image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80"],
    category: "sundae", tags: ["matcha","parfait"], rating: 4.8, sold: 456, isBestSeller: true, stock: 30,
    variants: JSON.stringify([{ name: "Regular", price: 42000 },{ name: "Large", price: 58000 }]),
  },
  {
    id: "3", name: "Bubblegum Dream Shake", slug: "bubblegum-dream-shake",
    description: "Milkshake bubblegum pink dengan marshmallow dan sprinkle pelangi.",
    price: 35000, image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80"],
    category: "drink", tags: ["bubblegum","milkshake"], rating: 4.7, sold: 634, isBestSeller: true, stock: 40,
  },
  {
    id: "4", name: "Taro Mochi Scoop", slug: "taro-mochi-scoop",
    description: "Es krim taro ungu lembut dengan mochi kenyal di dalamnya.",
    price: 32000, image: "https://images.unsplash.com/photo-1553531889-56cc480ac5cb?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1553531889-56cc480ac5cb?w=600&q=80"],
    category: "ice-cream", tags: ["taro","mochi","lavender"], rating: 4.8, sold: 521, stock: 25,
  },
  {
    id: "5", name: "Choco Lava Sundae", slug: "choco-lava-sundae",
    description: "Sundae coklat dengan lava sauce lumer dan brownie crumble.",
    price: 38000, image: "https://images.pexels.com/photos/2693447/pexels-photo-2693447.jpeg",
    images: ["https://images.pexels.com/photos/2693447/pexels-photo-2693447.jpeg"],
    category: "sundae", tags: ["coklat","lava"], rating: 4.9, sold: 743, isBestSeller: true, stock: 35,
  },
  {
    id: "6", name: "Mango Sunset Panna Cotta", slug: "mango-sunset-panna-cotta",
    description: "Panna cotta mangga dengan layer jelly sunset yang cantik.",
    price: 30000, image: "https://images.pexels.com/photos/1352281/pexels-photo-1352281.jpeg",
    images: ["https://images.pexels.com/photos/1352281/pexels-photo-1352281.jpeg"],
    category: "dessert", tags: ["mango","panna-cotta"], rating: 4.6, sold: 312, stock: 20,
  },
  {
    id: "7", name: "Unicorn Sprinkle Scoop", slug: "unicorn-sprinkle-scoop",
    description: "Vanilla scoop dengan sprinkle unicorn dan edible glitter — favorit anak-anak.",
    price: 26000, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80"],
    category: "ice-cream", tags: ["unicorn","vanilla"], rating: 4.7, sold: 678, isNew: true, stock: 45,
    variants: JSON.stringify([{ name: "1 Scoop", price: 26000 },{ name: "2 Scoop", price: 44000 }]),
  },
  {
    id: "8", name: "Pistachio Chrome Scoop", slug: "pistachio-chrome-scoop",
    description: "Pistachio premium dengan efek chrome glaze hijau mint yang estetik.",
    price: 34000, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80"],
    category: "ice-cream", tags: ["pistachio","chrome","mint"], rating: 4.8, sold: 389, isNew: true, stock: 28,
  },
  {
    id: "9", name: "Sweet Box Party (6 pcs)", slug: "sweet-box-party",
    description: "Box isi 6: 2 scoop + 2 sundae mini + 2 panna cotta — perfect untuk berbagi.",
    price: 125000, originalPrice: 150000,
    image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600&q=80"],
    category: "bundle", tags: ["bundle","hemat"], rating: 4.9, sold: 234, isBestSeller: true, stock: 15,
  },
  {
    id: "10", name: "Cookies & Cream Dream", slug: "cookies-cream-dream",
    description: "Es krim cookies & cream dengan cookie crumble berlimpah.",
    price: 30000, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80"],
    category: "ice-cream", tags: ["cookies","cream"], rating: 4.6, sold: 445, stock: 30,
  },
  {
    id: "11", name: "Lychee Rose Milk Tea", slug: "lychee-rose-milk-tea",
    description: "Milk tea lychee dengan aroma rose dan boba kenyal.",
    price: 28000, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80"],
    category: "drink", tags: ["lychee","rose"], rating: 4.5, sold: 298, stock: 35,
  },
  {
    id: "12", name: "Strawberry Cheesecake Box", slug: "strawberry-cheesecake-box",
    description: "Dessert box cheesecake strawberry dengan crumble biscuit.",
    price: 36000, image: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
    images: ["https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg"],
    category: "dessert", tags: ["strawberry","cheesecake"], rating: 4.8, sold: 512, stock: 22,
  },
]

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({ where: { id: cat.id }, update: cat, create: cat })
  }
  const hashed = await bcrypt.hash("admin123", 12)
  await prisma.user.upsert({ where: { username: "admin" }, update: {}, create: { username: "admin", password: hashed, name: "Admin SweetScoop" } })
  for (const p of products) {
    const { id, category, ...rest } = p as any
    const data = { ...rest, categoryId: category, images: JSON.stringify(p.images), tags: JSON.stringify(p.tags), variants: (p as any).variants ?? "[]" }
    await prisma.product.upsert({ where: { id }, update: data, create: { id, ...data } })
  }
  console.log("Seed done")
}
main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())

