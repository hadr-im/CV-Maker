'use client'

import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

import { useCV } from '@/lib/cv-context'
import { SECTIONS } from '@/lib/cv-sections'
import { Button } from '@/components/ui/button'
import { CertificationsForm } from '@/components/forms/certifications-form'
import { CustomSectionsForm } from '@/components/forms/custom-sections-form'
import { EducationForm } from '@/components/forms/education-form'
import { ExperienceForm } from '@/components/forms/experience-form'
import { PersonalInfoForm } from '@/components/forms/personal-info-form'
import { ProjectsForm } from '@/components/forms/projects-form'
import { SkillsForm } from '@/components/forms/skills-form'
import { cn } from '@/lib/utils'

export function EditorPanel({
  collapsed = false,
  onToggleCollapsed,
}: {
  /** Small screens only — folds the form away so the preview gets the room. */
  collapsed?: boolean
  onToggleCollapsed?: () => void
} = {}) {
  const { activeSection, setActiveSection } = useCV()

  const index = SECTIONS.findIndex((section) => section.id === activeSection)
  const current = SECTIONS[index] ?? SECTIONS[0]
  const previous = index > 0 ? SECTIONS[index - 1] : null
  const next = index < SECTIONS.length - 1 ? SECTIONS[index + 1] : null

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 sm:px-5">
        {/* Collapsed, the header is all that is left — so it names the section
            rather than saying "Editor", which would leave nothing on screen to
            say what is folded away. */}
        <h2 className="truncate text-sm font-semibold text-foreground">
          {collapsed ? current.heading : 'Editor'}
        </h2>

        <span className="ml-auto text-xs tabular-nums text-subtle-foreground">
          Step {index + 1} of {SECTIONS.length}
        </span>

        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand the form' : 'Collapse the form'}
            title={collapsed ? 'Expand the form' : 'Collapse the form to see more of the preview'}
            className="-mr-1 grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          >
            {collapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
          </button>
        )}
      </header>

      <div className={cn('flex-1 overflow-y-auto scrollbar-slim', collapsed && 'hidden')}>
        <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-7">
            <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {current.heading}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.hint}</p>
          </div>

          {/* Remounting per section keeps scroll position and field state predictable */}
          <div key={current.id} className="animate-fade-in">
            {current.id === 'personal' && <PersonalInfoForm />}
            {current.id === 'experience' && <ExperienceForm />}
            {current.id === 'projects' && <ProjectsForm />}
            {current.id === 'education' && <EducationForm />}
            {current.id === 'skills' && <SkillsForm />}
            {current.id === 'certifications' && <CertificationsForm />}
            {current.id === 'custom' && <CustomSectionsForm />}
          </div>

          <nav className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
            {previous ? (
              <Button variant="ghost" size="sm" onClick={() => setActiveSection(previous.id)}>
                <ArrowLeft />
                <span className="hidden sm:inline">{previous.label}</span>
                <span className="sm:hidden">Back</span>
              </Button>
            ) : (
              <span />
            )}

            {next && (
              <Button variant="outline" size="sm" onClick={() => setActiveSection(next.id)}>
                <span className="hidden sm:inline">{next.label}</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight />
              </Button>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
