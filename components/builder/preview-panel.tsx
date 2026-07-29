'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Download, FileWarning } from 'lucide-react'

import { useCV } from '@/lib/cv-context'
import { TEMPLATES, isCVEmpty } from '@/lib/cv-sections'
import { Button, buttonVariants } from '@/components/ui/button'
import { ClassicTemplate } from '@/components/templates/classic-template'
import { MinimalTemplate } from '@/components/templates/minimal-template'
import { ModernTemplate } from '@/components/templates/modern-template'
import { cn } from '@/lib/utils'

/** Seconds before the thank-you page takes over once the dialog closes. */
const REDIRECT_DELAY = 5

export function PreviewPanel() {
  const { cvData, template, typography } = useCV()
  const router = useRouter()
  const [printing, setPrinting] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  const empty = isCVEmpty(cvData)
  const activeTemplate = TEMPLATES.find((item) => item.id === template)

  // `afterprint` fires for a cancelled dialog exactly as it does for a saved
  // one, and the browser exposes nothing that separates them. Rather than guess,
  // the redirect happens on a visible countdown the user can stop — saving takes
  // you onward without a click, and cancelling costs one.
  useEffect(() => {
    if (!printing) return

    const onAfterPrint = () => {
      setPrinting(false)
      setCountdown(REDIRECT_DELAY)
    }

    window.addEventListener('afterprint', onAfterPrint)
    return () => window.removeEventListener('afterprint', onAfterPrint)
  }, [printing])

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      router.push('/thank-you')
      return
    }

    const timer = setTimeout(
      () => setCountdown((value) => (value === null ? null : value - 1)),
      1000,
    )
    return () => clearTimeout(timer)
  }, [countdown, router])

  const handleDownload = () => {
    setPrinting(true)
    // Let the state flush before the (blocking) print dialog opens.
    requestAnimationFrame(() => window.print())
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
          onClick={handleDownload}
          disabled={empty || printing}
          size="sm"
          title={empty ? 'Add some details first' : 'Open the print dialog and save as PDF'}
        >
          <Download />
          {printing ? 'Preparing…' : 'Download PDF'}
        </Button>
      </header>

      {countdown !== null && (
        <div className="no-print flex shrink-0 items-center justify-between gap-3 border-b border-border bg-accent/10 px-4 py-2.5 animate-fade-in sm:px-5">
          <p className="min-w-0 text-sm text-foreground">
            Next steps in <span className="tabular-nums">{countdown}</span>s
            <span className="hidden text-muted-foreground sm:inline">
              {' '}
              — stay here if you cancelled.
            </span>
          </p>

          <div className="flex shrink-0 items-center gap-1.5">
            <Button variant="outline" size="xs" onClick={() => setCountdown(null)}>
              Stay here
            </Button>
            <Link href="/thank-you" className={buttonVariants({ size: 'xs' })}>
              Go now
              <ArrowRight />
            </Link>
          </div>
        </div>
      )}

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
              // paper, and paper does not have rounded corners.
              'paper mx-auto w-full max-w-[46rem] overflow-hidden',
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
