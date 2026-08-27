"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLogin() {
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const router = useRouter()
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) })
    const data = await res.json()
    if (!res.ok) setError(data.error)
    else router.push("/admin")
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #FFF9F5, #FFE6EF)" }}>
      <form onSubmit={submit} className="glass-card rounded-[2rem] p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center" style={{ fontFamily: "var(--font-display)" }}>Admin — SweetShop</h1>
        <p className="text-xs text-center text-[var(--muted-foreground)]">Demo: admin / admin123 — change after first login</p>
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" size="lg">Sign In</Button>
      </form>
    </div>
  )
}
