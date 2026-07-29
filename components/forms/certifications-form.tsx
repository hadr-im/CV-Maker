'use client'

import { Award } from 'lucide-react'

import { useCV } from '@/lib/cv-context'
import { Input } from '@/components/ui/input'
import { AddMoreButton, EntryCard, Field, FieldRow, SectionEmpty } from '@/components/forms/form-parts'

export function CertificationsForm() {
  const { cvData, addCertification, updateCertification, deleteCertification } = useCV()

  const handleAdd = () => {
    addCertification({
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
      credentialUrl: '',
    })
  }

  if (cvData.certifications.length === 0) {
    return (
      <SectionEmpty
        icon={Award}
        title="No certifications added yet"
        body="Courses, licences and credentials. Add a verification link if the issuer provides one."
        actionLabel="Add a certification"
        onAction={handleAdd}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4">
        {cvData.certifications.map((entry, index) => (
          <EntryCard
            key={entry.id}
            index={index}
            title={entry.name || 'New certification'}
            onDelete={() => deleteCertification(entry.id)}
            deleteLabel={`Delete ${entry.name || 'this certification'}`}
          >
            <Field label="Certification name" htmlFor={`certName-${entry.id}`} required>
              <Input
                id={`certName-${entry.id}`}
                value={entry.name}
                onChange={(event) => updateCertification(entry.id, { name: event.target.value })}
                placeholder="Project Management Professional (PMP)"
              />
            </Field>

            <FieldRow>
              <Field label="Issuer" htmlFor={`issuer-${entry.id}`} required>
                <Input
                  id={`issuer-${entry.id}`}
                  value={entry.issuer}
                  onChange={(event) =>
                    updateCertification(entry.id, { issuer: event.target.value })
                  }
                  placeholder="Project Management Institute"
                />
              </Field>

              <Field label="Date obtained" htmlFor={`certDate-${entry.id}`} required>
                <Input
                  id={`certDate-${entry.id}`}
                  value={entry.date}
                  onChange={(event) => updateCertification(entry.id, { date: event.target.value })}
                  placeholder="Mar 2024"
                />
              </Field>
            </FieldRow>

            <Field
              label="Credential URL"
              htmlFor={`certUrl-${entry.id}`}
              hint="Optional. Shown as a 'View credential' link on your CV."
            >
              <Input
                id={`certUrl-${entry.id}`}
                type="url"
                inputMode="url"
                value={entry.credentialUrl}
                onChange={(event) =>
                  updateCertification(entry.id, { credentialUrl: event.target.value })
                }
                placeholder="https://…"
              />
            </Field>
          </EntryCard>
        ))}
      </ul>

      <AddMoreButton label="Add another certification" onClick={handleAdd} />
    </div>
  )
}
