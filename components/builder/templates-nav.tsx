'use client'

import { Check } from 'lucide-react'
import { useCV } from '@/lib/cv-context'
import { TEMPLATES } from '@/lib/cv-sections'
import { TemplateGlyph } from '@/components/templates/template-glyph'
import { cn } from '@/lib/utils'

export function TemplatesNav({
  collapsed = false,
  onSelect,
}: {
  collapsed?: boolean
  onSelect?: () => void
}) {
  const { template, setTemplate } = useCV()

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 px-2 py-3">
        {TEMPLATES.map((item) => {
          const isActive = template === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTemplate(item.id)}
              title={item.name}
              aria-pressed={isActive}
              className={cn(
                'relative w-10 overflow-hidden rounded-md border-2 transition-all duration-200',
                isActive
                  ? 'border-primary shadow-soft-sm'
                  : 'border-border opacity-60 hover:border-border-strong hover:opacity-100',
              )}
            >
              <TemplateGlyph template={item.id} className="p-1" />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {TEMPLATES.map((item) => {
        const isActive = template === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTemplate(item.id)
              onSelect?.()
            }}
            aria-pressed={isActive}
            className={cn(
              'group relative w-full overflow-hidden rounded-xl border-2 p-2.5 text-left transition-all duration-200',
              isActive
                ? 'border-primary bg-primary/[0.06]'
                : 'border-border bg-card hover:border-border-strong hover:bg-muted/50',
            )}
          >
            <div className="flex gap-3">
              <div className="w-16 shrink-0 overflow-hidden rounded-md border border-border shadow-soft-xs">
                <TemplateGlyph template={item.id} className="p-1.5" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.tint }} />
                  <span className="truncate text-sm font-semibold text-foreground">{item.name}</span>
                  {isActive && (
                    <Check className="ml-auto size-3.5 shrink-0 text-primary" strokeWidth={3} />
                  )}
                </div>
                <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
