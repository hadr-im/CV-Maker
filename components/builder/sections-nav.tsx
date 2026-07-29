'use client'

import { useCV } from '@/lib/cv-context'
import { SECTIONS, getSectionCounts } from '@/lib/cv-sections'
import { cn } from '@/lib/utils'

/**
 * Section list. Rendered inside the desktop rail and inside the mobile drawer,
 * so it takes `collapsed` rather than owning that state.
 */
export function SectionsNav({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const { cvData, activeSection, setActiveSection } = useCV()
  const counts = getSectionCounts(cvData)

  return (
    <nav className={cn('flex flex-col gap-1', collapsed ? 'items-center px-2 py-3' : 'p-3')}>
      {SECTIONS.map((section) => {
        const Icon = section.icon
        const isActive = activeSection === section.id
        const count = counts[section.id] ?? 0

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => {
              setActiveSection(section.id)
              onNavigate?.()
            }}
            title={collapsed ? section.label : undefined}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              // Colour alone marks the active section — no fill, no rule, no
              // border. The rail is a list, and it reads as one.
              'group relative flex items-center rounded-lg text-sm transition-colors duration-150',
              collapsed ? 'size-10 justify-center' : 'w-full gap-3 px-3 py-2.5',
              isActive
                ? 'font-medium text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon
              className={cn(
                'size-4 shrink-0 transition-colors',
                isActive ? 'text-primary' : 'text-subtle-foreground group-hover:text-foreground',
              )}
            />
            {!collapsed && (
              <>
                <span className="flex-1 truncate text-left">{section.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      'grid h-5 min-w-5 place-items-center rounded-full bg-muted px-1.5 text-[0.7rem] font-medium tabular-nums',
                      isActive ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {count}
                  </span>
                )}
              </>
            )}
            {collapsed && count > 0 && (
              <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-primary" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
