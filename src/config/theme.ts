/**
 * Theme tokens — buyer edits here to recolor entire shop.
 * Mirrors src/app/globals.css :root vars.
 */
export const themeConfig = {
  // Nail Art Fresh (default) — buyer can swap to any palette
  background: "#FFF9F5",
  foreground: "#2D1A1E",
  primary: "#FF6B9D",
  primaryForeground: "#FFF9F5",
  secondary: "#A8E6CF",
  secondaryForeground: "#1A3A2A",
  accent: "#C3B1E1",
  accentForeground: "#2D1A1E",
  muted: "#FFF0E6",
  mutedForeground: "#8B6B73",
  border: "#FFD3E0",
  input: "#FFD3E0",
  ring: "#FF6B9D",
  card: "#FFFFFF",
  radius: "1rem",
} as const

export type ThemeConfig = typeof themeConfig
