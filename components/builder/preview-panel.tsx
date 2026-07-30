'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, FileWarning } from 'lucide-react'

import { useCV } from '@/lib/cv-context'
import { TEMPLATES, isCVEmpty } from '@/lib/cv-sections'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ClassicTemplate } from '@/components/templates/classic-template'
import { MinimalTemplate } from '@/components/templates/minimal-template'
import { ModernTemplate } from '@/components/templates/modern-template'
import { cn } from '@/lib/utils'

export function PreviewPanel() {
  const { cvData, template, typography, reset } = useCV()
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const empty = isCVEmpty(cvData)
  const activeTemplate = TEMPLATES.find((item) => item.id === template)

  // Cancelling here does nothing at all — no print, no clearing, no redirect.
  // Confirming does all three, but only once printing has actually finished.
  const handleConfirm = () => {
    setConfirmOpen(false)
    // One frame, so the confirmation is off screen before the print dialog opens.
    requestAnimationFrame(() => {
      // `window.print()` blocks synchronously on desktop, so `reset()` and the
      // redirect used to just follow it directly. Mobile Safari/Chrome's print
      // flow is a native share/print sheet that does not block the same way —
      // those two ran while it was still opening, wiping the CV and navigating
      // away before the OS had captured anything, which is what exported a
      // blank PDF. `afterprint` fires once printing is actually done, on both.
      const finish = () => {
        window.removeEventListener('afterprint', finish)
        reset()
        router.push('/thank-you')
      }
      window.addEventListener('afterprint', finish)
      window.print()
    })
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="no-print flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <h2 className="text-sm font-semibold text-foreground">Preview</h2>
          {activeTemplate && (
            <span
              className="hidden text-sm font-medium sm:inline"
              style={{ color: activeTemplate.tint }}
            >
              {activeTemplate.name}
            </span>
          )}
        </div>

        <Button
          onClick={() => setConfirmOpen(true)}
          disabled={empty}
          size="sm"
          title={empty ? 'Add some details first' : 'Open the print dialog and save as PDF'}
        >
          <Download />
          Download PDF
        </Button>
      </header>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="no-print max-w-sm">
          <DialogHeader>
            <DialogTitle>Download your CV?</DialogTitle>
            <DialogDescription>
              Give it one last read first — your name, your contact details and your dates.
              Downloading also clears the CV from this browser, so the PDF you save will be your
              only copy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              <Download />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 overflow-y-auto scrollbar-slim bg-muted/40 p-4 sm:p-6 lg:p-8">
        {empty ? (
          <EmptyState />
        ) : (
          <div
            id="cv-print-root"
            style={
              {
                '--cv-name-scale': typography.name,
                '--cv-links-scale': typography.links,
                '--cv-summary-scale': typography.summary,
                '--cv-title-scale': typography.sectionTitle,
                '--cv-entry-scale': typography.entryTitle,
                '--cv-body-scale': typography.body,
                '--cv-dates-scale': typography.dates,
                '--cv-leading': typography.lineHeight,
              } as React.CSSProperties
            }
            className={cn(
              // Square corners on purpose: this is meant to read as a sheet of
              // paper, and paper does not have rounded corners. Not
              // `overflow-hidden`: `.paper`'s `aspect-ratio` only acts as a
              // floor on an overflow-visible box — a CV longer than one page
              // needs to grow past it, not get clipped at the page edge.
              'paper mx-auto w-full max-w-[46rem]',
              'transition-shadow duration-300',
            )}
          >
            {template === 'modern' && <ModernTemplate data={cvData} />}
            {template === 'classic' && <ClassicTemplate data={cvData} />}
            {template === 'minimal' && <MinimalTemplate data={cvData} />}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mx-auto flex h-full min-h-[18rem] w-full max-w-[46rem] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border-strong bg-card/50 p-8 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-muted">
        <FileWarning className="size-5 text-subtle-foreground" />
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">Your CV will appear here</p>
        <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Start with your name in <span className="text-foreground">Personal info</span> — the
          preview updates as you type.
        </p>
      </div>
    </div>
  )
}
