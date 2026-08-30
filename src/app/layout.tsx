import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { ThemeProvider } from "@/components/theme-provider";
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  return (
    <html lang={siteConfig.locale} className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col">
        {gaId ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${gaId}');` }} />
          </>
        ) : null}
        <StoreProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
