'use client'

import { useEffect, useState } from 'react'
import { LayoutTemplate, PanelLeft, RotateCcw, Type } from 'lucide-react'

import { BrandWordmark } from '@/components/brand'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCV } from '@/lib/cv-context'
import { TypographyDialog } from '@/components/builder/typography-dialog'
import { getCompletion, isCVEmpty } from '@/lib/cv-sections'

export function BuilderHeader({
  onOpenSections,
  onOpenTemplates,
}: {
  onOpenSections: () => void
  onOpenTemplates: () => void
}) {
  const { cvData, reset } = useCV()
  const [confirmReset, setConfirmReset] = useState(false)
  const [typographyOpen, setTypographyOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const completion = getCompletion(cvData)
  const empty = isCVEmpty(cvData)

  // Mirrors the 1s debounce in CVProvider's autosave.
  useEffect(() => {
    if (empty) return
    setSaved(false)
    const timer = setTimeout(() => setSaved(true), 1000)
    return () => clearTimeout(timer)
  }, [cvData, empty])

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenSections}
            aria-label="Open sections"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          >
            <PanelLeft className="size-4" />
          </button>
          <BrandWordmark className="ml-1 shrink-0" />
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex items-center gap-2.5">
            <div
              className="h-1 w-56 overflow-hidden rounded-full bg-muted lg:w-80"
              role="progressbar"
              aria-valuenow={completion}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="CV completion"
            >
              {/* Two layers so the gradient is *revealed* rather than squeezed:
                  the inner bar is always the full width of the track, and the
                  clipping wrapper is what grows. Squeezing a gradient into the
                  filled portion would shift every colour as the bar advanced. */}
              <div
                className="h-full overflow-hidden transition-[width] duration-500 ease-out"
                style={{ width: `${completion}%` }}
              >
                <div className="h-full w-56 rounded-full bg-linear-to-r from-brand-coral via-brand-amber to-brand-teal lg:w-80" />
              </div>
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">{completion}%</span>
          </div>
          <span className="text-xs text-subtle-foreground">
            {empty ? 'Nothing saved yet' : saved ? 'Saved locally' : 'Saving…'}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTypographyOpen(true)}
            aria-label="Text size"
            title="Text size"
          >
            <Type />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setConfirmReset(true)}
            disabled={empty}
            aria-label="Start over"
            title="Start over"
            className="hidden sm:inline-flex"
          >
            <RotateCcw />
          </Button>
          <ThemeToggle />
          <button
            type="button"
            onClick={onOpenTemplates}
            aria-label="Open templates"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          >
            <LayoutTemplate className="size-4" />
          </button>
        </div>
      </header>

      <TypographyDialog open={typographyOpen} onOpenChange={setTypographyOpen} />

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Start over?</DialogTitle>
            <DialogDescription>
              This clears every section and the copy saved in this browser. It cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReset(false)}>
              Keep editing
            </Button>
            <Button
              variant="destructive"
              className="bg-destructive/10 text-destructive hover:bg-destructive/20"
              onClick={() => {
                reset()
                setConfirmReset(false)
              }}
            >
              Clear everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
