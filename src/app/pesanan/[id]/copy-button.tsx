"use client"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useState } from "react"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }
  return (
    <Button variant="outline" className="w-full" onClick={handleCopy}>
      <Copy className="w-4 h-4" /> {copied ? "Tersalin!" : "Salin ID"}
    </Button>
  )
}
