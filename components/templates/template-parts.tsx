import { Fragment, type ComponentType, type SVGProps } from 'react'
import { Globe, Mail, MapPin, Phone } from 'lucide-react'

import type { CVData } from '@/lib/types'
import { cn } from '@/lib/utils'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

/**
 * lucide dropped its brand icons in v1, so the two that have no generic
 * equivalent are inline. Solid rather than stroked, which is how both marks are
 * meant to be drawn anyway.
 */
function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-1.96c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

/**
 * The one colour any horizontal rule in any template is allowed to be, always
 * at 1px. Templates carry no accent colour: a recruiter's ATS reads text, and a
 * hiring manager reads a document that looks like a document.
 */
export const RULE_COLOR = '#d1d5db'

/**
 * Fonts for the exported document. Every name here is either installed by
 * default on Windows and macOS or metric-compatible with one that is, so the
 * PDF looks the same wherever it was made — and each appears on the ATS safe
 * lists.
 *
 * Deliberately *not* the app's UI font: that inherits `system-ui`, which
 * resolves to Segoe UI on Windows, SF on macOS and something else again on
 * Linux. The same CV would export as a different document per user.
 */
export const CV_FONT_SANS = "Arial, Helvetica, 'Liberation Sans', sans-serif"

/**
 * Cambria first, not Georgia. Georgia sets old-style figures by default — the
 * digits sit at different heights and some drop below the baseline, which makes
 * a phone number look misaligned. Cambria uses lining figures, is on the ATS
 * safe lists, and ships with Windows and with Office on macOS.
 */
export const CV_FONT_SERIF = "Cambria, Georgia, 'Times New Roman', 'Liberation Serif', serif"

/**
 * 10pt is the floor every ATS guide gives for body text. At 96dpi 1rem = 12pt,
 * so 0.85rem (≈10.2pt) is the smallest size allowed anywhere in a template —
 * dates and labels included, since a parser makes no distinction.
 */
export const CV_TEXT_MIN = '0.85rem'

/** "Jan 2022 – Present" / "Jan 2022 – Dec 2024" / "Jan 2022" */
export function formatRange(start: string, end?: string, isCurrent?: boolean) {
  if (!start && !end) return ''
  if (isCurrent) return `${start} – Present`
  if (end) return `${start} – ${end}`
  return start
}

export interface ContactItem {
  key: string
  value: string
  href: string | null
  icon: IconComponent
}

/**
 * Contact line items, in a fixed order, with the empties dropped.
 *
 * The icons are decoration only — every item also carries readable text (the
 * address itself, or "GitHub"), so a parser that discards the SVG still gets
 * the content. That is the difference between an icon and an icon-only CV,
 * which is the thing ATS guidance actually warns about.
 */
export function contactItems(personalInfo: CVData['personalInfo']): ContactItem[] {
  const { github, linkedin, portfolio, email, phone, location } = personalInfo

  const items: (ContactItem | null)[] = [
    github ? { key: 'github', value: 'GitHub', href: github, icon: GithubIcon } : null,
    linkedin ? { key: 'linkedin', value: 'LinkedIn', href: linkedin, icon: LinkedinIcon } : null,
    portfolio ? { key: 'portfolio', value: 'Portfolio', href: portfolio, icon: Globe } : null,
    email ? { key: 'email', value: email, href: `mailto:${email}`, icon: Mail } : null,
    phone
      ? { key: 'phone', value: phone, href: `tel:${phone.replace(/\s/g, '')}`, icon: Phone }
      : null,
    location ? { key: 'location', value: location, href: null, icon: MapPin } : null,
  ]

  return items.filter((item): item is ContactItem => item !== null)
}

/** One contact item: icon plus its text, as a link when there is one. */
export function ContactLine({ item, className }: { item: ContactItem; className?: string }) {
  const Icon = item.icon
  const content = (
    <>
      <Icon aria-hidden="true" className="size-[1.05em] shrink-0" strokeWidth={2} />
      {item.value}
    </>
  )

  return item.href ? (
    <a href={item.href} className={cn('inline-flex items-center gap-1.5 hover:underline', className)}>
      {content}
    </a>
  ) : (
    <span className={cn('inline-flex items-center gap-1.5', className)}>{content}</span>
  )
}

/** The "Technologies: …" line under an experience or project entry. */
export function TechLine({ value, className }: { value: string; className?: string }) {
  if (!value.trim()) return null
  return (
    <p className={cn('mt-1', className)}>
      <span className="font-medium">Technologies:</span> {value}
    </p>
  )
}

/**
 * The entire markup grammar the editor produces: ***both***, **bold**,
 * *italic*. Three inline marks is not a markdown document, so this is a split
 * on one regex rather than a parser or a dependency.
 *
 * The triple has to be listed and tested first. Matching `**` before `***`
 * splits `***both***` into `*`, `**both**`, `*`, leaving a bare asterisk at each
 * end — which is what was printing stray stars into the exported CV whenever a
 * run was bold and italic at once.
 *
 * Bold and italic are both safe for ATS parsers; they read the text content and
 * discard the emphasis.
 */
const INLINE_MARKS = /(\*\*\*[^*\n]+\*\*\*|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g

function renderInline(text: string) {
  return text
    .split(INLINE_MARKS)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('***') && part.endsWith('***') && part.length > 6) {
        return (
          <strong key={index} className="font-semibold">
            <em>{part.slice(3, -3)}</em>
          </strong>
        )
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={index}>{part.slice(1, -1)}</em>
      }
      return <Fragment key={index}>{part}</Fragment>
    })
}

/** Any single run of user text that may carry bold/italic marks. */
export function InlineText({ text }: { text: string }) {
  return <>{renderInline(text)}</>
}

/**
 * One line per achievement, with any bullet character the user typed themselves
 * stripped — otherwise a pasted "- built the checkout" renders as "• - built
 * the checkout".
 */
function bulletLines(text: string) {
  return text
    .split('\n')
    .map((line) => line.replace(LEADING_BULLET, '').trim())
    .filter(Boolean)
}

/**
 * A leading bullet the user typed themselves. An asterisk only counts as one
 * when a space follows it: without that guard this ate the opening `**` of a
 * bold line, so "**test**" reached the page as "test**".
 */
const LEADING_BULLET = /^\s*(?:[-–—•·]+\s*|\*+\s+)/

/**
 * Renders an entry's free-text description. Multiple lines become a real `<ul>`
 * with default disc markers, which is what ATS guidance asks for and what a
 * recruiter scans; a single line stays a paragraph, since one bullet on its own
 * looks like a mistake.
 */
export function EntryDescription({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const lines = bulletLines(text)
  if (lines.length === 0) return null

  if (lines.length === 1) {
    return (
      <p className={className}>
        <InlineText text={lines[0]} />
      </p>
    )
  }

  return (
    <ul className={cn('list-disc space-y-0.5 pl-[1.1em]', className)}>
      {lines.map((line, index) => (
        <li key={index}>
          <InlineText text={line} />
        </li>
      ))}
    </ul>
  )
}
