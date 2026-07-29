'use client'

import { useEffect, useState } from 'react'

/**
 * Returns false during SSR and on the first client render, then settles on the
 * real match. Guard layout switches with `mounted` where a flash would show.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    setMounted(true)

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return { matches, mounted }
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)')
}
