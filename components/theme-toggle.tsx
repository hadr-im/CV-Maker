'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
      className={cn(
        'relative grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground',
        'transition-colors hover:border-border-strong hover:text-foreground',
        className,
      )}
    >
      {/* Both icons render; only the active one is visible, so the button never resizes. */}
      <Sun
        className={cn(
          'absolute size-4 transition-all duration-300',
          mounted && isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0',
        )}
      />
      <Moon
        className={cn(
          'absolute size-4 transition-all duration-300',
          mounted && !isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0',
        )}
      />
    </button>
  )
}
