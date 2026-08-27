"use client"
import { useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { Button } from "@/components/ui/button"
import { DynamicFrameLayout } from "@/components/ui/dynamic-frame-layout"
import type { Product, Category } from "@/types"
import { ProductCard } from "@/components/product-card"
import { Sparkles, ArrowRight, Heart, Play, Pause } from "lucide-react"
import { siteConfig } from "@/config/site"

gsap.registerPlugin(ScrollTrigger)

const flavorScenes = [
  { bg: "#FFE6EF", accent: "#FF6B9D", name: "Strawberry Glaze", desc: "Glossy glaze like donut nails", emoji: "🍓" },
  { bg: "#E6F7ED", accent: "#6BCB77", name: "Pistachio Chrome", desc: "Chrome mint aesthetic", emoji: "🥑" },
  { bg: "#EDE7FF", accent: "#8B7DD9", name: "Taro Mochi", desc: "Soft purple + chewy mochi", emoji: "🍠" },
]

export function HomeScenes({ products, categories }: { products: Product[]; categories: Category[] }) {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const flavorsRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeFlavor, setActiveFlavor] = useState(0)

  const fallbackImages = products.slice(0, 9).map((p) => p.image)
  const frames = [
    { id: 1, video: "https://cdn.coverr.co/videos/coverr-making-an-ice-cream-sundae-1578255178700?download=1", defaultPos: { x: 0, y: 0, w: 4, h: 4 } },
    { id: 2, video: "https://cdn.coverr.co/videos/coverr-scooping-ice-cream-1578123456789?download=1", defaultPos: { x: 4, y: 0, w: 4, h: 4 } },
    { id: 3, video: "https://videos.pexels.com/video-files/3191570/3191570-uhd_2560_1440_25fps.mp4", defaultPos: { x: 8, y: 0, w: 4, h: 4 } },
    { id: 4, video: "https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4", defaultPos: { x: 0, y: 4, w: 4, h: 4 } },
    { id: 5, video: "https://videos.pexels.com/video-files/3191570/3191570-uhd_2560_1440_25fps.mp4", defaultPos: { x: 4, y: 4, w: 4, h: 4 } },
    { id: 6, video: "https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4", defaultPos: { x: 8, y: 4, w: 4, h: 4 } },
    { id: 7, video: "https://cdn.coverr.co/videos/coverr-making-an-ice-cream-sundae-1578255178700?download=1", defaultPos: { x: 0, y: 8, w: 4, h: 4 } },
    { id: 8, video: "https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4", defaultPos: { x: 4, y: 8, w: 4, h: 4 } },
    { id: 9, video: "https://videos.pexels.com/video-files/3191570/3191570-uhd_2560_1440_25fps.mp4", defaultPos: { x: 8, y: 8, w: 4, h: 4 } },
  ].map((f, i) => ({ ...f, fallback: fallbackImages[i % fallbackImages.length] })) as any

  useGSAP(() => {
    // progress bar — like video timeline
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: "100%",
        ease: "none",
        scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom bottom", scrub: 0.3 },
      })
    }
    if (reduced) return

    // HERO — entrance plays immediately (no scrub), then gentle parallax on scroll
    // ponytail: pin removed — scrubbed pin hid caption until scroll, fatal for first impression
    if (heroRef.current) {
      // entrance - immediate, not tied to scroll
      const tl = gsap.timeline()
      tl.from("[data-hero-badge]", { y: -20, opacity: 0, duration: 0.5, ease: "power2.out" }, 0)
        .from("[data-hero-h1] > span > span", { y: 40, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power3.out" }, 0.1)
        .from("[data-hero-desc]", { y: 16, opacity: 0, duration: 0.4, ease: "power2.out" }, 0.35)
        .from("[data-hero-cta] > *", { y: 16, opacity: 0, stagger: 0.06, duration: 0.4, ease: "power2.out" }, 0.45)
        .from("[data-hero-scoop-card]", { scale: 0.92, y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.2)
        .from("[data-hero-scoop] [data-scoop]", { scale: 0, rotation: -10, stagger: 0.07, duration: 0.45, ease: "back.out(1.5)" }, 0.35)
      // subtle parallax while scrolling - no pin, caption stays visible
      gsap.to("[data-hero-scoop-card]", {
        y: -24, rotation: 1,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
      })
      gsap.to("[data-hero-arc]", {
        scale: 1.12, x: 12,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
      })
      gsap.to("[data-shutter]", {
        opacity: 0.08,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
      })
    }

    // FLAVOR — bg & cards crossfade like video chapters
    if (flavorsRef.current) {
      flavorScenes.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: flavorsRef.current,
          start: `${(i / flavorScenes.length) * 100}% center`,
          end: `${((i + 1) / flavorScenes.length) * 100}% center`,
          onEnter: () => setActiveFlavor(i),
          onEnterBack: () => setActiveFlavor(i),
        })
      })
      // cards parallax inside flavor
      gsap.to("[data-flavor-cards] > *", {
        y: -20, stagger: 0.06,
        scrollTrigger: { trigger: flavorsRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
      })
    }

    // GALLERY — each tile scales like video reveal, scrubbed
    gsap.from("[data-gallery-tile]", {
      scale: 0.85, opacity: 0, stagger: { each: 0.04, from: "center" },
      scrollTrigger: { trigger: "[data-gallery]", start: "top 85%", end: "top 35%", scrub: 1 },
    })

    // BEST SELLER — horizontal dolly pan (pinned, no collision — short track)
    const hSection = document.querySelector("[data-h-scroll]") as HTMLElement | null
    const hTrack = document.querySelector("[data-h-track]") as HTMLElement | null
    if (hSection && hTrack) {
      const getScroll = () => Math.max(0, hTrack.scrollWidth - hSection.clientWidth + 32)
      gsap.to(hTrack, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: hSection,
          start: "top top",
          end: () => `+=${getScroll()}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }

    // SWATCH — strong parallax like film strip
    gsap.to("[data-swatch]", {
      y: -50, rotation: 1, stagger: 0.07,
      scrollTrigger: { trigger: "[data-swatch-section]", start: "top bottom", end: "bottom top", scrub: 1 },
    })
    // CTA — scale like video end card
    gsap.from("[data-cta-card]", {
      scale: 0.92, y: 30, opacity: 0,
      scrollTrigger: { trigger: "[data-cta-card]", start: "top 90%", end: "top 60%", scrub: 1 },
    })
  }, { scope: containerRef, dependencies: [reduced] })

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 6)

  return (
    <div ref={containerRef} className="flex flex-col">
      {/* video progress bar */}
      <div ref={progressRef} className="fixed top-0 left-0 h-1.5 bg-[var(--primary)] z-[60] w-0" style={{ boxShadow: "0 0 8px var(--primary)" }} aria-hidden />
      {/* video timecode */}
      <div className="fixed top-3 right-4 z-[60] hidden sm:flex items-center gap-2 text-[10px] font-mono bg-black/70 text-white px-2.5 py-1 rounded-full backdrop-blur">
        <Play className="w-3 h-3 fill-white" /> REC 00:00 / 00:30
      </div>

      {/* SCENE 1 — Hero pinned video */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF9F5 0%, #FFF0E6 60%, #FFE6EF 100%)" }}>
        {/* shutter lines */}
        <div data-shutter className="pointer-events-none absolute inset-0 opacity-0" style={{ background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)" }} />
        <div data-hero-arc className="pointer-events-none absolute -top-12 -right-12 w-[40vw] h-[40vw] rounded-full border-[24px] border-white/60" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-white french-tip opacity-60" style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
        <div className="mx-auto max-w-6xl px-4 py-12 w-full grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <span data-hero-badge className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-white border border-[var(--border)] shadow-sm">
              <span className="w-2 h-2 rounded-full rhinestone animate-pulse" /> {siteConfig.hero.badge}
            </span>
            <h1 data-hero-h1 className="text-5xl sm:text-6xl font-bold leading-[0.95] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              <span className="block overflow-hidden"><span className="block">{siteConfig.hero.titleLine1}</span></span>
              <span className="glaze-text block overflow-hidden"><span className="block">{siteConfig.hero.titleLine2}</span></span>
              <span className="block overflow-hidden"><span data-hero-subtitle className="block text-3xl sm:text-4xl font-medium text-[var(--muted-foreground)] mt-2">{siteConfig.hero.titleLine3}</span></span>
            </h1>
            <p data-hero-desc className="text-[var(--muted-foreground)] max-w-md">{siteConfig.hero.description}</p>
            <div data-hero-cta className="flex flex-wrap gap-3">
              <Link href="/menu"><Button size="lg">View Menu <ArrowRight className="w-4 h-4" /></Button></Link>
              <Link href="#flavors"><Button variant="outline" size="lg">Explore Flavors</Button></Link>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><Heart className="w-3.5 h-3.5 text-[var(--primary)]" /> 1.2k+ happy customers this week</div>
          </div>
          <div className="relative flex items-center justify-center">
            <div data-hero-scoop className="relative">
              <div data-hero-scoop-card className="w-[280px] sm:w-[360px] aspect-[3/4] rounded-[2.5rem] glass-card p-6 flex flex-col items-center justify-center gap-3 overflow-hidden will-change-transform">
                <div className="flex -space-x-2">
                  <span data-scoop className="w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg will-change-transform" style={{ background: "#FFD3E0" }}>🍓</span>
                  <span data-scoop className="w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg will-change-transform" style={{ background: "#C3F0D0" }}>🍵</span>
                  <span data-scoop className="w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg will-change-transform" style={{ background: "#E6DFF7" }}>🍠</span>
                </div>
                <div className="w-32 h-24 rounded-b-[2rem] flex items-center justify-center" style={{ background: "linear-gradient(180deg, #F5D5A0, #E8B87A)" }}>🧇</div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)]">{siteConfig.name} Cone</p>
                <div className="flex gap-1.5"><span className="w-2 h-2 rounded-full rhinestone" /><span className="w-2 h-2 rounded-full rhinestone" /><span className="w-2 h-2 rounded-full rhinestone" /></div>
              </div>
              <span className="absolute -top-3 -right-3 text-xl animate-pulse">✨</span>
              <span className="absolute -bottom-2 -left-2 text-lg animate-pulse" style={{ animationDelay: "0.6s" }}>💅</span>
            </div>
          </div>
        </div>
        {/* scroll hint like video play */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[10px] tracking-widest uppercase text-[var(--muted-foreground)] animate-bounce">
          <Pause className="w-4 h-4" /> scroll untuk play
        </div>
      </section>

      {/* SCENE 2 — Flavor Journey */}
      <section ref={flavorsRef} id="flavors" className="relative" style={{ background: flavorScenes[activeFlavor].bg, transition: "background 600ms ease" }}>
        <div data-flavor-pin className="min-h-[60vh] flex items-center">
          <div className="mx-auto max-w-6xl px-4 py-16 w-full grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[var(--muted-foreground)]">Flavor Journey • 0{activeFlavor + 1} / 03</p>
              <h2 className="text-4xl font-bold mt-2 will-change-transform" style={{ fontFamily: "var(--font-display)" }}>{flavorScenes[activeFlavor].name}</h2>
              <p className="text-[var(--muted-foreground)] mt-2">{flavorScenes[activeFlavor].desc}</p>
              <div className="flex gap-2 mt-6" role="tablist" aria-label="Pilih rasa">
                {flavorScenes.map((f, i) => (
                  <button key={f.name} role="tab" aria-selected={i === activeFlavor} aria-label={f.name} onClick={() => setActiveFlavor(i)} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg transition-all focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 ${i === activeFlavor ? "scale-110 shadow-lg" : "opacity-60"}`} style={{ background: f.bg, borderColor: f.accent }}>{f.emoji}</button>
                ))}
              </div>
              <Link href="/menu" className="inline-block mt-6"><Button>Order this flavor</Button></Link>
            </div>
            <div data-flavor-cards className="grid grid-cols-2 gap-3">
              {products.slice(activeFlavor * 2, activeFlavor * 2 + 4).map((p) => (
                <div key={p.id} className="glass-card rounded-2xl p-3 flex flex-col gap-2 will-change-transform">
                  <img src={p.image} alt={p.name} className="w-full aspect-square rounded-xl object-cover" />
                  <p className="text-sm font-semibold leading-tight" style={{ fontFamily: "var(--font-display)" }}>{p.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{p.description.slice(0, 60)}…</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 3 — Galeri 9 */}
      <section className="py-16 bg-white" aria-label="Galeri video rasa" data-gallery>
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-[var(--primary)] flex items-center justify-center gap-2"><Sparkles className="w-4 h-4" /> Flavor Gallery</p>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ fontFamily: "var(--font-display)" }}>Hover to peek — <span className="glaze-text">flavor videos</span></h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">9 loop videos — hover to feel the motion.</p>
          </div>
          <div className="mt-8 h-[520px] rounded-[2rem] overflow-hidden border border-[var(--border)] p-2 bg-[var(--muted)]/40">
            <DynamicFrameLayout frames={frames} hoverSize={6} gapSize={4} />
          </div>
        </div>
        {/* hidden stagger tiles for scrub */}
        <div className="hidden">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} data-gallery-tile />
          ))}
        </div>
      </section>

      {/* SCENE 4 — Best Seller horizontal dolly */}
      <section data-h-scroll className="relative bg-[var(--muted)]/30 py-16 overflow-hidden" aria-label="Best seller">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Best Seller — <span className="text-[var(--primary)]">geser seperti video pan</span></h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Scroll vertikal = kamera pan horizontal — seperti video.</p>
        </div>
        <div className="mt-8 overflow-hidden">
          <div data-h-track className="flex gap-4 px-4 pb-2 will-change-transform" style={{ width: "max-content" }}>
            {bestSellers.map((p) => (
              <div key={p.id} className="w-[280px] flex-shrink-0"><ProductCard product={p} /></div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 5 — Swatch film strip + CTA */}
      <section data-swatch-section className="py-16" style={{ background: "linear-gradient(180deg, #FFF9F5, #FFF0E6)" }}>
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map((c) => (
              <div key={c.id} data-swatch className="glass-card rounded-2xl p-4 text-center will-change-transform" style={{ transitionDelay: `${0}ms` }}>
                <span className="text-2xl">{c.emoji}</span>
                <p className="text-xs font-bold mt-2">{c.name}</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">{c.description.slice(0, 28)}</p>
              </div>
            ))}
          </div>
          <div data-cta-card className="mt-12 glass-card rounded-[2rem] p-8 sm:p-12 text-center will-change-transform">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Ready for something sweet?</h2>
            <p className="text-[var(--muted-foreground)] mt-2 max-w-xl mx-auto">Fast checkout — pay your way. Orders processed instantly.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link href="/menu"><Button size="lg">Order Now</Button></Link>
              <Link href="/admin/login"><Button variant="outline" size="lg">Admin Login</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
