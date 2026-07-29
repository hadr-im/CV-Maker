'use client'

import { useState } from 'react'
import { X, Zap } from 'lucide-react'

import { useCV } from '@/lib/cv-context'
import { Input } from '@/components/ui/input'
import { AddMoreButton, EntryCard, Field, SectionEmpty } from '@/components/forms/form-parts'

export function SkillsForm() {
  const { cvData, addSkill, updateSkill, deleteSkill } = useCV()
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const handleAdd = () => {
    addSkill({ id: crypto.randomUUID(), category: '', skills: [] })
  }

  const commitDraft = (id: string, current: string[], rawValue: string) => {
    const draft = rawValue.trim().replace(/,$/, '').trim()
    if (!draft) return
    // Accept a pasted comma-separated list as well as a single skill.
    const additions = draft
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0 && !current.includes(value))
    if (additions.length > 0) {
      updateSkill(id, { skills: [...current, ...additions] })
    }
    setDrafts((previous) => ({ ...previous, [id]: '' }))
  }

  if (cvData.skills.length === 0) {
    return (
      <SectionEmpty
        icon={Zap}
        title="No skills added yet"
        body="Group skills under a category — 'Languages', 'Design tools' — so they read cleanly on the page."
        actionLabel="Add your first category"
        onAction={handleAdd}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4">
        {cvData.skills.map((entry, index) => (
          <EntryCard
            key={entry.id}
            index={index}
            title={entry.category || 'New category'}
            onDelete={() => deleteSkill(entry.id)}
            deleteLabel={`Delete ${entry.category || 'this category'}`}
          >
            <Field label="Category" htmlFor={`category-${entry.id}`} required>
              <Input
                id={`category-${entry.id}`}
                value={entry.category}
                onChange={(event) => updateSkill(entry.id, { category: event.target.value })}
                placeholder="Software & tools"
              />
            </Field>

            <Field
              label="Skills"
              htmlFor={`skills-${entry.id}`}
              required
              hint="Press Enter or comma to add each one. Pasting a comma-separated list works too."
            >
              <Input
                id={`skills-${entry.id}`}
                value={drafts[entry.id] ?? ''}
                onChange={(event) => {
                  const value = event.target.value
                  setDrafts((previous) => ({ ...previous, [entry.id]: value }))
                  // Committed from the event's own value, not the `drafts` state — that
                  // state read is still one render behind at this point in the handler,
                  // which silently dropped a pasted "a, b," on the floor.
                  if (value.endsWith(',')) commitDraft(entry.id, entry.skills, value)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    commitDraft(entry.id, entry.skills, drafts[entry.id] ?? '')
                  }
                  if (
                    event.key === 'Backspace' &&
                    (drafts[entry.id] ?? '').length === 0 &&
                    entry.skills.length > 0
                  ) {
                    updateSkill(entry.id, { skills: entry.skills.slice(0, -1) })
                  }
                }}
                onBlur={() => commitDraft(entry.id, entry.skills, drafts[entry.id] ?? '')}
                placeholder="Excel, Salesforce, Photoshop…"
              />
            </Field>

            {entry.skills.length > 0 && (
              <ul className="-mt-1 flex flex-wrap gap-1.5">
                {entry.skills.map((skill) => (
                  <li key={skill}>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/60 py-1 pl-2.5 pr-1 text-xs font-medium text-foreground">
                      {skill}
                      <button
                        type="button"
                        onClick={() =>
                          updateSkill(entry.id, {
                            skills: entry.skills.filter((value) => value !== skill),
                          })
                        }
                        aria-label={`Remove ${skill}`}
                        className="grid size-4 place-items-center rounded text-subtle-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </EntryCard>
        ))}
      </ul>

      <AddMoreButton label="Add another category" onClick={handleAdd} />
    </div>
  )
}
