'use client'

import type { CSSProperties } from 'react'

import type { CVData } from '@/lib/types'
import {
  CV_FONT_SERIF,
  ContactLine,
  EntryDescription,
  InlineText,
  RULE_COLOR,
  TechLine,
  contactItems,
  formatRange,
} from './template-parts'

export function ClassicTemplate({ data }: { data: CVData }) {
  const { personalInfo } = data
  const contacts = contactItems(personalInfo)

  return (
    <article
      className="print-container bg-white p-7 text-[#1f2937] sm:p-8"
      style={
        {
          fontFamily: CV_FONT_SERIF,
          // Insurance for any serif that still defaults to old-style figures:
          // dates and phone numbers must sit on one baseline.
          fontVariantNumeric: 'lining-nums',
          '--cv-name-base': '1.75rem',
          '--cv-links-base': '0.78rem',
          '--cv-summary-base': '0.85rem',
          '--cv-title-base': '0.85rem',
          '--cv-entry-base': '0.95rem',
          '--cv-body-base': '0.85rem',
          '--cv-dates-base': '0.85rem',
        } as CSSProperties
      }
    >
      {(personalInfo.fullName || contacts.length > 0) && (
        <header className="mb-5 text-center">
          {personalInfo.fullName && (
            <h1 className="cv-name font-bold uppercase tracking-[0.12em] text-[#111827]">
              {personalInfo.fullName}
            </h1>
          )}
          {contacts.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 cv-links uppercase tracking-[0.08em] text-[#4b5563]">
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
          <div className="space-y-3">
            {data.experience.map((entry) => (
              <div key={entry.id} className="cv-entry">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <h3 className="cv-entry-title font-semibold text-[#111827]">{entry.title}</h3>
                  <span className="cv-dates text-[#6b7280]">
                    {formatRange(entry.startDate, entry.endDate, entry.isCurrent)}
                  </span>
                </div>
                {entry.company && (
                  <p className="cv-body font-medium italic text-[#4b5563]">
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
                <TechLine
                  value={entry.technologies}
                  className="cv-body italic text-[#6b7280]"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-3">
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
                  <span className="cv-dates text-[#6b7280]">{entry.date}</span>
                </div>
                {entry.repoUrl && (
                  <p className="cv-body italic text-[#4b5563]">
                    <a href={entry.repoUrl} className="underline">
                      Source
                    </a>
                  </p>
                )}
                <EntryDescription
                  text={entry.description}
                  className="cv-body mt-1 text-[#374151]"
                />
                <TechLine
                  value={entry.technologies}
                  className="cv-body italic text-[#6b7280]"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          <div className="space-y-3">
            {data.education.map((entry) => (
              <div key={entry.id} className="cv-entry">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <h3 className="cv-entry-title font-semibold text-[#111827]">{entry.degree}</h3>
                  <span className="cv-dates text-[#6b7280]">
                    {formatRange(entry.startDate, entry.endDate)}
                  </span>
                </div>
                {entry.school && (
                  <p className="cv-body font-medium italic text-[#4b5563]">
                    {entry.school}
                    {entry.field && ` — ${entry.field}`}
                  </p>
                )}
                <EntryDescription
                  text={entry.details}
                  className="cv-body mt-1 text-[#374151]"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills">
          <div className="space-y-1.5">
            {data.skills.map((entry) => (
              <p key={entry.id} className="cv-body text-[#374151]">
                <span className="font-semibold text-[#111827]">{entry.category}</span>
                {entry.category && entry.skills.length > 0 && ': '}
                {entry.skills.join(', ')}
              </p>
            ))}
          </div>
        </Section>
      )}

      {data.certifications.length > 0 && (
        <Section title="Certifications">
          <div className="space-y-2.5">
            {data.certifications.map((entry) => (
              <div key={entry.id} className="cv-entry">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <h3 className="cv-entry-title font-semibold text-[#111827]">{entry.name}</h3>
                  <span className="cv-dates text-[#6b7280]">{entry.date}</span>
                </div>
                <p className="cv-body text-[#4b5563]">
                  {entry.issuer}
                  {entry.credentialUrl && (
                    <>
                      {entry.issuer && ' · '}
                      <a href={entry.credentialUrl} className="underline">
                        View credential
                      </a>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
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
      <h2 className="cv-section-title font-bold uppercase tracking-[0.14em] text-[#111827]">
        {title}
      </h2>
      <div className="mb-2.5 mt-1 h-px w-full" style={{ backgroundColor: RULE_COLOR }} />
      {children}
    </section>
  )
}
