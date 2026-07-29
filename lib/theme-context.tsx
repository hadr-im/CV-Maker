'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  /** False until the client has read the stored preference — use it to avoid icon flicker. */
  mounted: boolean
}

const STORAGE_KEY = 'cv-theme'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

/**
 * Runs before paint so the correct theme class is on <html> from the first frame.
 * Kept in sync with `STORAGE_KEY` above.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var c=document.documentElement.classList;d?c.add('dark'):c.remove('dark');document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setThemeState(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    setMounted(true)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement
    root.classList.toggle('dark', next === 'dark')
    root.style.colorScheme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode, blocked cookies) — theme still applies for the session.
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
  }, [setTheme])

  // Follow the OS only while the user has not made an explicit choice.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null
      try {
        stored = localStorage.getItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      if (stored) return
      const next: Theme = event.matches ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', next === 'dark')
      document.documentElement.style.colorScheme = next
      setThemeState(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
