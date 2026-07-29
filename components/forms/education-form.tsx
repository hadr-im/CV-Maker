'use client'

import { GraduationCap } from 'lucide-react'

import { normalizeCVDate } from '@/lib/cv-date'
import { useCV } from '@/lib/cv-context'
import { Input } from '@/components/ui/input'
import { FormattedTextarea } from '@/components/forms/formatted-textarea'
import { AddMoreButton, EntryCard, Field, FieldRow, SectionEmpty } from '@/components/forms/form-parts'

export function EducationForm() {
  const { cvData, addEducation, updateEducation, deleteEducation } = useCV()

  const handleAdd = () => {
    addEducation({
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      details: '',
    })
  }

  if (cvData.education.length === 0) {
    return (
      <SectionEmpty
        icon={GraduationCap}
        title="No education added yet"
        body="List your degrees, starting with the most recent. Short courses belong under Certifications."
        actionLabel="Add your first degree"
        onAction={handleAdd}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4">
        {cvData.education.map((entry, index) => (
          <EntryCard
            key={entry.id}
            index={index}
            title={entry.degree || entry.school || 'New qualification'}
            onDelete={() => deleteEducation(entry.id)}
            deleteLabel={`Delete ${entry.degree || 'this qualification'}`}
          >
            <FieldRow>
              <Field label="School / university" htmlFor={`school-${entry.id}`} required>
                <Input
                  id={`school-${entry.id}`}
                  value={entry.school}
                  onChange={(event) => updateEducation(entry.id, { school: event.target.value })}
                  placeholder="University of Tunis"
                />
              </Field>

              <Field label="Degree" htmlFor={`degree-${entry.id}`} required>
                <Input
                  id={`degree-${entry.id}`}
                  value={entry.degree}
                  onChange={(event) => updateEducation(entry.id, { degree: event.target.value })}
                  placeholder="Bachelor of Science"
                />
              </Field>
            </FieldRow>

            <Field label="Field of study" htmlFor={`field-${entry.id}`}>
              <Input
                id={`field-${entry.id}`}
                value={entry.field}
                onChange={(event) => updateEducation(entry.id, { field: event.target.value })}
                placeholder="Business Administration"
              />
            </Field>

            <FieldRow>
              {/* Tidied on blur — see the note in experience-form. */}
              <Field label="Start date" htmlFor={`eduStart-${entry.id}`} required>
                <Input
                  id={`eduStart-${entry.id}`}
                  value={entry.startDate}
                  onChange={(event) => updateEducation(entry.id, { startDate: event.target.value })}
                  onBlur={(event) =>
                    updateEducation(entry.id, { startDate: normalizeCVDate(event.target.value) })
                  }
                  placeholder="Sep 2018"
                />
              </Field>

              <Field label="End date" htmlFor={`eduEnd-${entry.id}`}>
                <Input
                  id={`eduEnd-${entry.id}`}
                  value={entry.endDate}
                  onChange={(event) => updateEducation(entry.id, { endDate: event.target.value })}
                  onBlur={(event) =>
                    updateEducation(entry.id, { endDate: normalizeCVDate(event.target.value) })
                  }
                  placeholder="Jun 2022"
                />
              </Field>
            </FieldRow>

            <Field
              label="Additional details"
              htmlFor={`details-${entry.id}`}
              hint="Honours, average, thesis title or relevant coursework — optional."
            >
              <FormattedTextarea
                id={`details-${entry.id}`}
                value={entry.details}
                onValueChange={(details) => updateEducation(entry.id, { details })}
                placeholder="Graduated with honours. Key subjects, a dissertation title, anything relevant."
                className="min-h-20"
              />
            </Field>
          </EntryCard>
        ))}
      </ul>

      <AddMoreButton label="Add another qualification" onClick={handleAdd} />
    </div>
  )
}
