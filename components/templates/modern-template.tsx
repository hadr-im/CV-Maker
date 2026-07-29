'use client'

import type { CSSProperties } from 'react'

import type { CVData } from '@/lib/types'
import {
  CV_FONT_SANS,
  ContactLine,
  EntryDescription,
  InlineText,
  RULE_COLOR,
  TechLine,
  contactItems,
  formatRange,
} from './template-parts'

export function ModernTemplate({ data }: { data: CVData }) {
  const { personalInfo } = data
  const contacts = contactItems(personalInfo)

  return (
    <article
      className="print-container bg-white p-7 text-[#1f2937] sm:p-8"
      style={
        {
          fontFamily: CV_FONT_SANS,
          '--cv-name-base': '2rem',
          '--cv-links-base': '0.9rem',
          '--cv-summary-base': '0.9rem',
          '--cv-title-base': '1.15rem',
          '--cv-entry-base': '0.95rem',
          '--cv-body-base': '0.85rem',
          '--cv-dates-base': '0.85rem',
        } as CSSProperties
      }
    >
      {(personalInfo.fullName || contacts.length > 0) && (
        <header className="mb-5 border-b pb-3.5" style={{ borderColor: RULE_COLOR }}>
          {personalInfo.fullName && (
            <h1 className="cv-name font-bold leading-tight tracking-tight text-[#111827]">
              {personalInfo.fullName}
            </h1>
          )}
          {contacts.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 cv-links text-[#4b5563]">
              {contacts.map((item) => (
                <ContactLine key={item.key} item={item} />
              ))}
            </div>
          )}
        </header>
      )}

      {/* The summary gets its own titled section here rather than floating as a
          loose paragraph, so every block on the page is introduced the same way. */}
      {personalInfo.summary && (
        <section className="cv-section mb-5">
          <SectionTitle>About</SectionTitle>
          <p className="cv-summary text-[#374151]">
            <InlineText text={personalInfo.summary} />
          </p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="cv-section mb-5">
          <SectionTitle>Work Experience</SectionTitle>
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
                  <p className="cv-body font-medium text-[#4b5563]">
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
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="cv-section mb-5">
          <SectionTitle>Projects</SectionTitle>
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
                  <p className="cv-body text-[#4b5563]">
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
        </section>
      )}

      {data.education.length > 0 && (
        <section className="cv-section mb-5">
          <SectionTitle>Education</SectionTitle>
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
                  <p className="cv-body font-medium text-[#4b5563]">
                    {entry.school}
                    {entry.field && <span className="text-[#6b7280]"> · {entry.field}</span>}
                  </p>
                )}
                <EntryDescription
                  text={entry.details}
                  className="cv-body mt-1 text-[#374151]"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="cv-section mb-5">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-1.5">
            {data.skills.map((entry) => (
              <p key={entry.id} className="cv-body text-[#374151]">
                <span className="font-semibold text-[#111827]">{entry.category}</span>
                {entry.category && entry.skills.length > 0 && ' — '}
                {entry.skills.join(', ')}
              </p>
            ))}
          </div>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="cv-section mb-5">
          <SectionTitle>Certifications</SectionTitle>
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
        </section>
      )}

      {data.customSections.map((section) => (
        <section key={section.id} className="cv-section mb-5">
          <SectionTitle>{section.title}</SectionTitle>
          <p className="whitespace-pre-wrap cv-body text-[#374151]">
            <InlineText text={section.content} />
          </p>
        </section>
      ))}
    </article>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="cv-section-title mb-2 font-bold tracking-tight text-[#111827]">{children}</h2>
  )
}
