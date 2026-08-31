import { chromium } from 'playwright';
const urls = [
  { name: 'localhost-success', url: 'http://localhost:3000/pesanan/cmtfwdbup0001h4uumxqjh6rn?phone=12345678' },
  { name: 'vercel-success', url: 'https://sweetshop-green.vercel.app/pesanan/cmtfwdbup0001h4uumxqjh6rn?phone=12345678' },
  { name: 'vercel-notfound', url: 'https://sweetshop-green.vercel.app/pesanan/cmtfxs29t000104kyia4fo8ob?phone=12345678' },
];
const browser = await chromium.launch();
for (const u of urls) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(u.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(3000);
  const path = `C:/Users/melki/AppData/Local/Temp/opencode/${u.name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`shot ${u.name} -> ${path} title: ${await page.title()}`);
  const text = await page.textContent('body');
  console.log(text.slice(0, 300).replace(/\s+/g, ' '));
  await page.close();
}
await browser.close();
