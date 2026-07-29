import type { TemplateType } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Layout diagram for a template, for the places too small to render a real page.
 * The builder rail shows these at 40–64px wide, where a scaled-down CV is grey
 * mush — so each glyph draws only what actually distinguishes the layout: where
 * the name sits, and how sections are separated.
 *
 * The full-page previews on the marketing site use `TemplateThumb` instead,
 * which renders the real template component.
 */

function Bar({ className }: { className?: string }) {
  return <div className={cn('h-[3px] rounded-full bg-[#17171a]/15', className)} />
}

function Rule({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-[#17171a]/30', className)} />
}

export function TemplateGlyph({
  template,
  className,
}: {
  template: TemplateType
  className?: string
}) {
  return (
    <div aria-hidden="true" className={cn('aspect-[1/1.294] w-full bg-white p-2', className)}>
      {/* Modern — name hard left with a rule directly beneath it. */}
      {template === 'modern' && (
        <div className="flex h-full flex-col gap-1.5">
          <Bar className="h-[5px] w-3/5 bg-[#17171a]/55" />
          <Rule />
          <Bar className="w-full" />
          <Bar className="w-4/5" />
          <Bar className="mt-auto h-[4px] w-2/5 bg-[#17171a]/40" />
          <Bar className="w-full" />
          <Bar className="w-10/12" />
        </div>
      )}

      {/* Classic — centred header, every section title ruled. */}
      {template === 'classic' && (
        <div className="flex h-full flex-col gap-1.5">
          <Bar className="mx-auto h-[5px] w-1/2 bg-[#17171a]/55" />
          <Bar className="mx-auto w-2/3" />
          <Bar className="mt-1 h-[4px] w-2/5 bg-[#17171a]/40" />
          <Rule />
          <Bar className="w-full" />
          <Bar className="mt-auto h-[4px] w-1/3 bg-[#17171a]/40" />
          <Rule />
          <Bar className="w-3/4" />
        </div>
      )}

      {/* Minimal — no rules anywhere, space doing the separating. */}
      {template === 'minimal' && (
        <div className="flex h-full flex-col gap-2">
          <Bar className="h-[5px] w-2/5 bg-[#17171a]/55" />
          <Bar className="w-1/2" />
          <Bar className="mt-1.5 h-[3px] w-1/4 bg-[#17171a]/35" />
          <Bar className="w-full" />
          <Bar className="mt-auto h-[3px] w-1/5 bg-[#17171a]/35" />
          <Bar className="w-3/5" />
        </div>
      )}
    </div>
  )
}
