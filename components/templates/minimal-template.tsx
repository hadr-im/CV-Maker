'use client'

import type { CSSProperties } from 'react'

import type { CVData } from '@/lib/types'
import {
  CV_FONT_SANS,
  ContactLine,
  EntryDescription,
  InlineText,
  TechLine,
  contactItems,
  formatRange,
} from './template-parts'

export function MinimalTemplate({ data }: { data: CVData }) {
  const { personalInfo } = data
  const contacts = contactItems(personalInfo)

  return (
    <article
      className="print-container bg-white p-7 text-[#1f2937] sm:p-9"
      style={
        {
          fontFamily: CV_FONT_SANS,
          '--cv-name-base': '1.6rem',
          '--cv-links-base': '0.85rem',
          '--cv-summary-base': '0.85rem',
          '--cv-title-base': '0.85rem',
          '--cv-entry-base': '0.9rem',
          '--cv-body-base': '0.85rem',
          '--cv-dates-base': '0.85rem',
        } as CSSProperties
      }
    >
      {(personalInfo.fullName || contacts.length > 0) && (
        <header className="mb-5">
          {personalInfo.fullName && (
            <h1 className="cv-name font-semibold tracking-tight text-[#111827]">
              {personalInfo.fullName}
            </h1>
          )}
          {contacts.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-x-3.5 gap-y-1 cv-links text-[#6b7280]">
              {contacts.map((item) => (
                <ContactLine key={item.key} item={item} />
              ))}
            </div>
          )}
        </header>
      )}

      {personalInfo.summary && (
        <p className="cv-summary mb-5 text-[#374151]">
          <InlineText text={personalInfo.summary} />
        </p>
      )}

      {data.experience.length > 0 && (
        <Section title="Work Experience">
          {data.experience.map((entry) => (
            <div key={entry.id} className="cv-entry">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <h3 className="cv-entry-title font-semibold text-[#111827]">{entry.title}</h3>
                <span className="cv-dates text-[#9ca3af]">
                  {formatRange(entry.startDate, entry.endDate, entry.isCurrent)}
                </span>
              </div>
              {entry.company && (
                <p className="cv-body text-[#6b7280]">
                  {entry.companyUrl ? (
                    <a href={entry.companyUrl} className="hover:underline">
                      {entry.company}
                    </a>
                  ) : (
                    entry.company
                  )}
                </p>
              )}
              <EntryDescription
                text={entry.description}
                className="cv-body mt-1 text-[#374151]"
              />
              <TechLine value={entry.technologies} className="cv-body text-[#9ca3af]" />
            </div>
          ))}
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          {data.projects.map((entry) => (
            <div key={entry.id} className="cv-entry">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <h3 className="cv-entry-title font-semibold text-[#111827]">
                  {entry.url ? (
                    <a href={entry.url} className="hover:underline">
                      {entry.name}
                    </a>
                  ) : (
                    entry.name
                  )}
                </h3>
                <span className="cv-dates text-[#9ca3af]">{entry.date}</span>
              </div>
              {entry.repoUrl && (
                <p className="cv-body text-[#6b7280]">
                  <a href={entry.repoUrl} className="underline">
                    Source
                  </a>
                </p>
              )}
              <EntryDescription
                text={entry.description}
                className="cv-body mt-1 text-[#374151]"
              />
              <TechLine value={entry.technologies} className="cv-body text-[#9ca3af]" />
            </div>
          ))}
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          {data.education.map((entry) => (
            <div key={entry.id} className="cv-entry">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <h3 className="cv-entry-title font-semibold text-[#111827]">{entry.degree}</h3>
                <span className="cv-dates text-[#9ca3af]">
                  {formatRange(entry.startDate, entry.endDate)}
                </span>
              </div>
              {entry.school && (
                <p className="cv-body text-[#6b7280]">
                  {entry.school}
                  {entry.field && ` · ${entry.field}`}
                </p>
              )}
              <EntryDescription
                text={entry.details}
                className="cv-body mt-1 text-[#374151]"
              />
            </div>
          ))}
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills">
          {data.skills.map((entry) => (
            <p key={entry.id} className="cv-body text-[#374151]">
              <span className="font-semibold text-[#111827]">{entry.category}</span>
              {entry.category && entry.skills.length > 0 && ': '}
              {entry.skills.join(', ')}
            </p>
          ))}
        </Section>
      )}

      {data.certifications.length > 0 && (
        <Section title="Certifications">
          {data.certifications.map((entry) => (
            <div key={entry.id} className="cv-entry">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <h3 className="cv-entry-title font-semibold text-[#111827]">{entry.name}</h3>
                <span className="cv-dates text-[#9ca3af]">{entry.date}</span>
              </div>
              <p className="cv-body text-[#6b7280]">
                {entry.issuer}
                {entry.credentialUrl && (
                  <>
                    {entry.issuer && ' · '}
                    <a href={entry.credentialUrl} className="underline">
                      View
                    </a>
                  </>
                )}
              </p>
            </div>
          ))}
        </Section>
      )}

      {data.customSections.map((section) => (
        <Section key={section.id} title={section.title}>
          <p className="whitespace-pre-wrap cv-body text-[#374151]">
            <InlineText text={section.content} />
          </p>
        </Section>
      ))}
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cv-section mb-5">
      <h2 className="cv-section-title mb-2 font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
