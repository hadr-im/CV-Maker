import { ClassicTemplate } from '@/components/templates/classic-template'
import { MinimalTemplate } from '@/components/templates/minimal-template'
import { ModernTemplate } from '@/components/templates/modern-template'
import { SAMPLE_CV } from '@/lib/sample-cv'
import type { TemplateType } from '@/lib/types'
import { cn } from '@/lib/utils'

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
} as const

/**
 * How far the page is scaled down for the thumbnail. The page is sized as a
 * percentage of the frame and *then* scaled by a constant, so
 * `(100 / SCALE)% × SCALE` resolves to exactly 100% of the frame at any width —
 * an exact fit with no measuring, no container queries and no per-breakpoint
 * values. Lower fits more of the page in but shrinks the text; this sits where
 * the name and section titles still read and the body becomes texture.
 */
const SCALE = 0.62

/**
 * Preview of a template, rendered from the real template component with
 * stand-in data rather than an abstract impression of it. Whatever a template
 * does — the accent rule, the centred header, the ruled section titles — shows
 * up here, and it cannot fall out of step with what the builder produces.
 */
export function TemplateThumb({
  template,
  className,
}: {
  template: TemplateType
  className?: string
}) {
  const Template = TEMPLATE_COMPONENTS[template]

  return (
    // `inert` matters as much as `aria-hidden` here: the templates render real
    // mailto/tel links, and a hidden subtree must not stay keyboard-reachable.
    <div
      aria-hidden="true"
      inert
      className={cn(
        'relative aspect-[1/1.294] w-full overflow-hidden rounded-lg bg-white',
        className,
      )}
    >
      <div
        className="origin-top-left"
        style={{ width: `${100 / SCALE}%`, transform: `scale(${SCALE})` }}
      >
        <Template data={SAMPLE_CV} />
      </div>

      {/* The page carries on past the frame, so fade the cut rather than
          slicing through a line of text. The page is white in both themes. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-white" />
    </div>
  )
}
