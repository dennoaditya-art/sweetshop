import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { siteConfig } from "@/config/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Fredoka({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
