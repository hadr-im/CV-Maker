'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { BrandWordmark } from '@/components/brand'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#templates', label: 'Templates' },
  { href: '/#group', label: 'The group' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Never leave the mobile menu open behind a closed hamburger on resize.
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const onChange = () => setMenuOpen(false)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || menuOpen
          ? 'border-b border-border bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <BrandWordmark />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-[0.95rem] font-medium text-foreground transition-colors hover:text-brand-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/builder"
            className={cn(
              buttonVariants({ size: 'sm' }),
              'hidden shadow-none hover:shadow-none sm:inline-flex',
            )}
          >
            Build my CV
            <ArrowRight className="size-3.5" />
          </Link>

          {/* Pushed past the CTA to the corner, with a hairline so the two read
              as separate controls rather than one cluster. */}
          <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <ThemeToggle className="sm:ml-1" />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[0.95rem] font-medium text-foreground transition-colors hover:text-brand-blue"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/builder"
              onClick={() => setMenuOpen(false)}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'mt-2 w-full shadow-none hover:shadow-none',
              )}
            >
              Build my CV
              <ArrowRight className="size-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
