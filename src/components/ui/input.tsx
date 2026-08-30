import * as React from "react"
import { cn } from "@/lib/utils"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn("flex h-10 w-full rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] px-4 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:opacity-50", className)} ref={ref} {...props} />
))
Input.displayName = "Input"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea className={cn("flex min-h-[80px] w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] px-4 py-3 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]", className)} ref={ref} {...props} />
))
Textarea.displayName = "Textarea"
