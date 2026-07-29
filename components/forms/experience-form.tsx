'use client'

import { useState } from 'react'
import { Briefcase, Sparkles } from 'lucide-react'

import { normalizeCVDate } from '@/lib/cv-date'
import { useCV } from '@/lib/cv-context'
import type { ExperienceEntry } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormattedTextarea } from '@/components/forms/formatted-textarea'
import { EnhanceModal } from '@/components/enhance-modal'
import {
  AddMoreButton,
  EntryCard,
  Field,
  FieldRow,
  SectionEmpty,
} from '@/components/forms/form-parts'

const DESCRIPTION_GUIDE = {
  points: [
    'One line per thing you did. Start with a verb: built, wrote, helped.',
    'Add a number if you have one.',
    'Two or three lines is plenty.',
  ],
  example: 'Built the sign-up page and fixed 15 bugs reported by the team.',
}

export function ExperienceForm() {
  const { cvData, addExperience, updateExperience, deleteExperience } = useCV()
  const [enhancingId, setEnhancingId] = useState<string | null>(null)

  const handleAdd = () => {
    addExperience({
      id: crypto.randomUUID(),
      title: '',
      company: '',
      companyUrl: '',
      technologies: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    })
  }

  const enhancing = cvData.experience.find((entry) => entry.id === enhancingId)

  if (cvData.experience.length === 0) {
    return (
      <SectionEmpty
        icon={Briefcase}
        title="No experience added yet"
        body="Add each role you want on your CV. Rough notes are fine — AI can tidy them afterwards."
        actionLabel="Add your first role"
        onAction={handleAdd}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4">
        {cvData.experience.map((entry, index) => (
          <EntryCard
            key={entry.id}
            index={index}
            title={entry.title || entry.company || 'New position'}
            onDelete={() => deleteExperience(entry.id)}
            deleteLabel={`Delete ${entry.title || 'this role'}`}
          >
            <FieldRow>
              <Field label="Job title" htmlFor={`title-${entry.id}`} required>
                <Input
                  id={`title-${entry.id}`}
                  value={entry.title}
                  onChange={(event) => updateExperience(entry.id, { title: event.target.value })}
                  placeholder="Project Coordinator"
                />
              </Field>

              <Field label="Company" htmlFor={`company-${entry.id}`} required>
                <Input
                  id={`company-${entry.id}`}
                  value={entry.company}
                  onChange={(event) => updateExperience(entry.id, { company: event.target.value })}
                  placeholder="Acme Inc."
                />
              </Field>
            </FieldRow>

            <Field
              label="Company website"
              htmlFor={`companyUrl-${entry.id}`}
              hint="Optional. Makes the company name a link in the exported CV."
            >
              <Input
                id={`companyUrl-${entry.id}`}
                type="url"
                inputMode="url"
                value={entry.companyUrl}
                onChange={(event) => updateExperience(entry.id, { companyUrl: event.target.value })}
                placeholder="https://acme.com"
              />
            </Field>

            <FieldRow>
              {/* Dates are tidied on blur, not while typing — an ATS can misread
                  "03/2022", but rewriting mid-keystroke fights the user. */}
              <Field label="Start date" htmlFor={`startDate-${entry.id}`} required>
                <Input
                  id={`startDate-${entry.id}`}
                  value={entry.startDate}
                  onChange={(event) =>
                    updateExperience(entry.id, { startDate: event.target.value })
                  }
                  onBlur={(event) =>
                    updateExperience(entry.id, {
                      startDate: normalizeCVDate(event.target.value),
                    })
                  }
                  placeholder="Jan 2022"
                />
              </Field>

              <Field label="End date" htmlFor={`endDate-${entry.id}`}>
                <Input
                  id={`endDate-${entry.id}`}
                  value={entry.isCurrent ? '' : entry.endDate}
                  onChange={(event) => updateExperience(entry.id, { endDate: event.target.value })}
                  onBlur={(event) =>
                    updateExperience(entry.id, { endDate: normalizeCVDate(event.target.value) })
                  }
                  placeholder={entry.isCurrent ? 'Present' : 'Dec 2024'}
                  disabled={entry.isCurrent}
                />
              </Field>
            </FieldRow>

            <div className="flex items-center gap-2.5">
              <Checkbox
                id={`current-${entry.id}`}
                checked={entry.isCurrent}
                onChange={(event) =>
                  updateExperience(entry.id, { isCurrent: event.target.checked })
                }
              />
              <Label htmlFor={`current-${entry.id}`} className="cursor-pointer text-foreground">
                I currently work here
              </Label>
            </div>

            <Field
              label="What you did there"
              htmlFor={`description-${entry.id}`}
              guide={DESCRIPTION_GUIDE}
            >
              <FormattedTextarea
                id={`description-${entry.id}`}
                value={entry.description}
                onValueChange={(description) => updateExperience(entry.id, { description })}
                placeholder="Write it however it comes out — one line per thing you did."
                toolbarExtra={
                  <Button
                    onClick={() => setEnhancingId(entry.id)}
                    disabled={
                      !entry.description.trim() || !entry.title.trim() || !entry.company.trim()
                    }
                    variant="ghost"
                    size="xs"
                    title={
                      entry.description.trim() && entry.title.trim() && entry.company.trim()
                        ? 'Rewrite these notes as CV bullet points'
                        : 'Fill in the title, company and some notes first'
                    }
                    className="text-highlight hover:bg-highlight/10 hover:text-highlight"
                  >
                    <Sparkles />
                    Enhance with AI
                  </Button>
                }
              />
            </Field>

            <Field
              label="Tools & technologies"
              htmlFor={`technologies-${entry.id}`}
              hint="Optional, comma separated. Rendered as its own line so a keyword scan finds them."
            >
              <Input
                id={`technologies-${entry.id}`}
                value={entry.technologies}
                onChange={(event) =>
                  updateExperience(entry.id, { technologies: event.target.value })
                }
                placeholder="Excel, Salesforce, Adobe InDesign"
              />
            </Field>
          </EntryCard>
        ))}
      </ul>

      <AddMoreButton label="Add another role" onClick={handleAdd} />

      {enhancing && (
        <EnhanceModal
          isOpen
          onClose={() => setEnhancingId(null)}
          title={enhancing.title}
          company={enhancing.company}
          description={enhancing.description}
          onSave={(bullets) => {
            updateExperience(enhancing.id, { description: bullets })
            setEnhancingId(null)
          }}
        />
      )}
    </div>
  )
}
