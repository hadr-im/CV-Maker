import { Heart } from 'lucide-react'
import { BrandWordmark } from '@/components/brand'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-6 text-xs text-subtle-foreground sm:flex-row sm:justify-between sm:gap-6 sm:px-8">
        <BrandWordmark />

        <p>© {new Date().getFullYear()} — All rights reserved.</p>

        <p className="flex items-center gap-1.5">
          Made with
          <Heart
            aria-label="love"
            className="size-3.5 fill-brand-coral text-brand-coral"
          />
          by the IM department
        </p>
      </div>
    </footer>
  )
}
