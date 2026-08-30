"use client"

import { useMemo } from "react"
import { dict, type Locale } from "@/config/dict"

export function useDict(locale?: Locale) {
  const loc = (locale as Locale) ?? "en"
  return useMemo(() => dict[loc] ?? dict.en, [loc])
}

export function getDict(locale: Locale) {
  return dict[locale] ?? dict.en
}