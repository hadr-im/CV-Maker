import type { CSSProperties } from 'react'

import { TYPOGRAPHY_DEFAULT } from '@/lib/cv-context'
import type { CVData, TemplateType, Typography } from '@/lib/types'
import { ClassicTemplate } from '@/components/templates/classic-template'
import { MinimalTemplate } from '@/components/templates/minimal-template'
import { ModernTemplate } from '@/components/templates/modern-template'

interface PrintPayload {
  cvData: CVData
  template: TemplateType
  typography: Typography
}

/**
 * Not part of the builder UI — this exists purely as a target for the
 * headless browser in app/api/export-pdf/route.ts to navigate to. It renders
 * with #cv-print-root and the .paper class, same as the live preview, so the
 * existing `@media print` rules in globals.css apply unchanged: the API
 * route emulates print media and calls page.pdf() against this page.
 *
 * Data arrives base64-encoded in the `data` query param rather than through
 * useCV()/localStorage — this page is rendered server-side, in a request that
 * has no browser session of its own to read those from.
 */
export default async function PrintPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>
}) {
  const { data } = await searchParams
  const payload = decodePayload(data)

  if (!payload) {
    return <p>Nothing to print.</p>
  }

  const { cvData, template, typography } = payload

  return (
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
        } as CSSProperties
      }
      className="paper"
    >
      {template === 'modern' && <ModernTemplate data={cvData} />}
      {template === 'classic' && <ClassicTemplate data={cvData} />}
      {template === 'minimal' && <MinimalTemplate data={cvData} />}
    </div>
  )
}

function decodePayload(data: string | undefined): PrintPayload | null {
  if (!data) return null
  try {
    const json = Buffer.from(data, 'base64url').toString('utf-8')
    const parsed = JSON.parse(json) as Partial<PrintPayload>
    if (!parsed.cvData || !parsed.template) return null
    return {
      cvData: parsed.cvData,
      template: parsed.template,
      typography: { ...TYPOGRAPHY_DEFAULT, ...parsed.typography },
    }
  } catch {
    return null
  }
}
