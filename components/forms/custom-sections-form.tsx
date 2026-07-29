'use client'

import { LayoutGrid } from 'lucide-react'

import { useCV } from '@/lib/cv-context'
import { Input } from '@/components/ui/input'
import { FormattedTextarea } from '@/components/forms/formatted-textarea'
import { AddMoreButton, EntryCard, Field, SectionEmpty } from '@/components/forms/form-parts'

export function CustomSectionsForm() {
  const { cvData, addCustomSection, updateCustomSection, deleteCustomSection } = useCV()

  const handleAdd = () => {
    addCustomSection({ id: crypto.randomUUID(), title: '', content: '' })
  }

  if (cvData.customSections.length === 0) {
    return (
      <SectionEmpty
        icon={LayoutGrid}
        title="Nothing extra yet"
        body="Languages, publications, volunteering, awards — anything the standard sections don't cover."
        actionLabel="Add a section"
        onAction={handleAdd}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4">
        {cvData.customSections.map((entry, index) => (
          <EntryCard
            key={entry.id}
            index={index}
            title={entry.title || 'New section'}
            onDelete={() => deleteCustomSection(entry.id)}
            deleteLabel={`Delete ${entry.title || 'this section'}`}
          >
            <Field label="Section title" htmlFor={`sectionTitle-${entry.id}`} required>
              <Input
                id={`sectionTitle-${entry.id}`}
                value={entry.title}
                onChange={(event) => updateCustomSection(entry.id, { title: event.target.value })}
                placeholder="Languages"
              />
            </Field>

            <Field
              label="Content"
              htmlFor={`sectionContent-${entry.id}`}
              required
              hint="Line breaks are preserved on the CV, so a short list works well here."
            >
              <FormattedTextarea
                id={`sectionContent-${entry.id}`}
                value={entry.content}
                onValueChange={(content) => updateCustomSection(entry.id, { content })}
                placeholder={'Arabic — native\nFrench — fluent\nEnglish — professional'}
              />
            </Field>
          </EntryCard>
        ))}
      </ul>

      <AddMoreButton label="Add another section" onClick={handleAdd} />
    </div>
  )
}
