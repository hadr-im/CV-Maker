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
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const empty = isCVEmpty(cvData)
  const activeTemplate = TEMPLATES.find((item) => item.id === template)

  // Cancelling does nothing at all — no export, no clearing, no redirect.
  // Confirming does all three, but only once the PDF has actually been built.
  //
  // The PDF itself is generated server-side (app/api/export-pdf), by driving
  // a real headless browser rather than rendering here in the visitor's own
  // one. Two things were tried and rejected first:
  //  1. `window.print()` against the browser's native print pipeline. Works
  //     on desktop, but Android hands printing off to the OS's own print
  //     service rather than rendering it itself, and that service did not
  //     reliably apply this page's CSS — it ignored the declared A4 size and
  //     exported a blank PDF.
  //  2. Rasterizing the preview to a canvas client-side and assembling that
  //     into a PDF image-by-image. That sidestepped the OS print service, but
  //     the result has no real text or clickable links — just a picture of
  //     the CV — which breaks ATS parsing and every href on the page.
  // A single controlled Chromium instance on the server produces genuine
  // HTML output (selectable text, working links) and behaves identically
  // regardless of which device or browser asked for the download.
  const handleConfirm = async () => {
    setDownloadError(null)
    setDownloading(true)
    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, template, typography }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(
          body?.detail ? `Export failed (${response.status}): ${body.detail}` : `Export failed: ${response.status}`,
        )
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const name = cvData.personalInfo.fullName.trim() || 'CV'
      const link = document.createElement('a')
      link.href = url
      link.download = `${name}.pdf`
      link.click()
      URL.revokeObjectURL(url)

      setConfirmOpen(false)
      reset()
      router.push('/thank-you')
    } catch (error) {
      console.error('[pdf export]', error)
      setDownloadError('Could not generate the PDF. Try again in a moment.')
    } finally {
      setDownloading(false)
    }
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
          title={empty ? 'Add some details first' : 'Generate a PDF and save it'}
        >
          <Download />
          Download PDF
        </Button>
      </header>

      <Dialog open={confirmOpen} onOpenChange={(open) => !downloading && setConfirmOpen(open)}>
        <DialogContent className="no-print max-w-sm">
          <DialogHeader>
            <DialogTitle>Download your CV?</DialogTitle>
            <DialogDescription>
              Give it one last read first — your name, your contact details and your dates.
              Downloading also clears the CV from this browser, so the PDF you save will be your
              only copy.
            </DialogDescription>
          </DialogHeader>

          {downloadError && (
            <p className="text-sm leading-relaxed text-destructive">{downloadError}</p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={downloading}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={downloading}>
              <Download />
              {downloading ? 'Generating…' : 'Download'}
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
