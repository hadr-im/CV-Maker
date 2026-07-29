'use client'

import Aurora from '@/components/Aurora'
import { useTheme } from '@/lib/theme-context'
import { useMediaQuery } from '@/lib/use-media-query'
import { cn } from '@/lib/utils'

/**
 * Aurora ramp per theme. Hex literals rather than tokens because the shader
 * hands each stop to `new Color(hex)` and cannot read a custom property.
 *
 * Dark mode uses the --brand-* values directly.
 *
 * Light mode needs the hue pushed, not softened. The visible tint is whatever
 * channel spread survives being composited onto #f5f5f5, so pastel stops read
 * as grey however strong the opacity is — they have barely any spread left to
 * begin with. These are the brand hues at full saturation and a higher value,
 * which keeps the spread wide; the band is kept off the background by lowering
 * the layer opacity in `.hero-aurora` instead.
 */
const STOPS: Record<'light' | 'dark', string[]> = {
  light: ['#ff6a4d', '#ffa227', '#12d7e0'],
  dark: ['#ff6b52', '#ffa03a', '#22cdd5'],
}

/**
 * Positions the WebGL aurora as a shallow band across the top of the hero.
 * Everything about its size, softness and opacity lives in `.hero-aurora`
 * (globals.css) so both pages that use it stay identical.
 */
export function HeroAurora({ className }: { className?: string }) {
  const { theme } = useTheme()
  const { matches: isNarrow } = useMediaQuery('(max-width: 639px)')

  // The shader's noise runs across the x axis, so a phone shows the same number
  // of waves in a third of the width — it reads as creases rather than a field.
  // Flattening the amplitude and widening the blend smooths it back out.
  return (
    <div aria-hidden="true" className={cn('hero-aurora', className)}>
      <Aurora
        colorStops={STOPS[theme]}
        amplitude={isNarrow ? 0.45 : 0.9}
        blend={isNarrow ? 0.95 : 0.6}
        speed={0.7}
      />
    </div>
  )
}
