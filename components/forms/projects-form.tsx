'use client'

import { FolderGit2 } from 'lucide-react'

import { normalizeCVDate } from '@/lib/cv-date'
import { useCV } from '@/lib/cv-context'
import { Input } from '@/components/ui/input'
import { FormattedTextarea } from '@/components/forms/formatted-textarea'
import {
  AddMoreButton,
  EntryCard,
  Field,
  FieldRow,
  SectionEmpty,
} from '@/components/forms/form-parts'

const DESCRIPTION_GUIDE = {
  points: [
    'Say what it does first, then how you built it.',
    'One line per point.',
    'A class project or something you built for fun both count.',
  ],
  example: 'A website where students can swap textbooks. Built it for a class project.',
}

export function ProjectsForm() {
  const { cvData, addProject, updateProject, deleteProject } = useCV()

  const handleAdd = () => {
    addProject({
      id: crypto.randomUUID(),
      name: '',
      url: '',
      repoUrl: '',
      date: '',
      description: '',
      technologies: '',
    })
  }

  if (cvData.projects.length === 0) {
    return (
      <SectionEmpty
        icon={FolderGit2}
        title="No projects yet"
        body="Anything you built or ran yourself. For students and career changers this often carries more weight than work experience."
        actionLabel="Add a project"
        onAction={handleAdd}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4">
        {cvData.projects.map((entry, index) => (
          <EntryCard
            key={entry.id}
            index={index}
            title={entry.name || 'Untitled project'}
            onDelete={() => deleteProject(entry.id)}
            deleteLabel={`Delete ${entry.name || 'this project'}`}
          >
            <FieldRow>
              <Field label="Project name" htmlFor={`projectName-${entry.id}`} required>
                <Input
                  id={`projectName-${entry.id}`}
                  value={entry.name}
                  onChange={(event) => updateProject(entry.id, { name: event.target.value })}
                  placeholder="Community Food Share"
                />
              </Field>

              <Field label="Date" htmlFor={`projectDate-${entry.id}`}>
                <Input
                  id={`projectDate-${entry.id}`}
                  value={entry.date}
                  onChange={(event) => updateProject(entry.id, { date: event.target.value })}
                  onBlur={(event) =>
                    updateProject(entry.id, { date: normalizeCVDate(event.target.value) })
                  }
                  placeholder="Nov 2025"
                />
              </Field>
            </FieldRow>

            <FieldRow>
              <Field
                label="Live link"
                htmlFor={`projectUrl-${entry.id}`}
                hint="Makes the project name clickable."
              >
                <Input
                  id={`projectUrl-${entry.id}`}
                  type="url"
                  inputMode="url"
                  value={entry.url}
                  onChange={(event) => updateProject(entry.id, { url: event.target.value })}
                  placeholder="https://yourproject.com"
                />
              </Field>

              <Field label="Repository" htmlFor={`projectRepo-${entry.id}`}>
                <Input
                  id={`projectRepo-${entry.id}`}
                  type="url"
                  inputMode="url"
                  value={entry.repoUrl}
                  onChange={(event) => updateProject(entry.id, { repoUrl: event.target.value })}
                  placeholder="https://github.com/you/project"
                />
              </Field>
            </FieldRow>

            <Field
              label="What it does"
              htmlFor={`projectDescription-${entry.id}`}
              guide={DESCRIPTION_GUIDE}
            >
                <FormattedTextarea
                  id={`projectDescription-${entry.id}`}
                  value={entry.description}
                  onValueChange={(description) => updateProject(entry.id, { description })}
                  placeholder="What it does, who it is for, and what came of it."
                />
            </Field>

            <Field
              label="Tools & technologies"
              htmlFor={`projectTech-${entry.id}`}
              hint="Optional, comma separated."
            >
              <Input
                id={`projectTech-${entry.id}`}
                value={entry.technologies}
                onChange={(event) => updateProject(entry.id, { technologies: event.target.value })}
                placeholder="Figma, Notion, Google Analytics"
              />
            </Field>
          </EntryCard>
        ))}
      </ul>

      <AddMoreButton label="Add another project" onClick={handleAdd} />
    </div>
  )
}
