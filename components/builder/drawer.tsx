'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Mobile-only slide-over. Sits above the builder chrome so the sidebars can
 * become drawers below the `lg` breakpoint.
 */
export function Drawer({
  open,
  onClose,
  side = 'left',
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  side?: 'left' | 'right'
  title: string
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <div
      className={cn('fixed inset-0 z-[90] lg:hidden', open ? 'visible' : 'invisible')}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-[#0e0e10]/60 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'absolute inset-y-0 flex w-[min(20rem,85vw)] flex-col bg-sidebar shadow-soft-lg',
          'transition-transform duration-300 ease-out',
          side === 'left'
            ? cn('left-0 border-r border-sidebar-border', open ? 'translate-x-0' : '-translate-x-full')
            : cn('right-0 border-l border-sidebar-border', open ? 'translate-x-0' : 'translate-x-full'),
        )}
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-slim">{children}</div>
      </aside>
    </div>
  )
}
