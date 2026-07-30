'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, FileWarning } from 'lucide-react'

import { useCV } from '@/lib/cv-context'
import { TEMPLATES, isCVEmpty } from '@/lib/cv-sections'
import { exportElementToPdf } from '@/lib/export-pdf'
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
  const paperRef = useRef<HTMLDivElement>(null)

  const empty = isCVEmpty(cvData)
  const activeTemplate = TEMPLATES.find((item) => item.id === template)

  // Cancelling does nothing at all — no export, no clearing, no redirect.
  // Confirming does all three, but only once the PDF has actually been built.
  //
  // This used to call `window.print()` and rely on the browser's native print
  // pipeline (`@media print` CSS + the OS print dialog). That works on
  // desktop, but Android hands printing off to its own OS print service
  // rather than rendering it itself, and that service did not reliably apply
  // this page's CSS — it ignored the declared A4 size and exported a blank
  // PDF. Rasterizing #cv-print-root ourselves and paginating it manually
  // (lib/export-pdf.ts) sidesteps that pipeline entirely, so the result is
  // identical on every device instead of depending on each one's print engine.
  const handleConfirm = async () => {
    const paper = paperRef.current
    if (!paper) return

    setDownloadError(null)
    setDownloading(true)
    try {
      const name = cvData.personalInfo.fullName.trim() || 'CV'
      await exportElementToPdf(paper, `${name}.pdf`)
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
            ref={paperRef}
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
