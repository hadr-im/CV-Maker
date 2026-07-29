import { Award, Briefcase, FolderGit2, GraduationCap, LayoutGrid, User, Zap, type LucideIcon } from 'lucide-react'
import type { CVData, TemplateType } from './types'

export interface SectionMeta {
  id: string
  label: string
  /** Shown as the panel title above the form. */
  heading: string
  hint: string
  icon: LucideIcon
}

export const SECTIONS: SectionMeta[] = [
  {
    id: 'personal',
    label: 'Personal info',
    heading: 'Personal information',
    hint: 'Name, contact details and the short summary at the top of your CV.',
    icon: User,
  },
  {
    id: 'experience',
    label: 'Experience',
    heading: 'Professional experience',
    hint: 'Where you have worked. Write rough notes — AI can tighten them for you.',
    icon: Briefcase,
  },
  {
    id: 'projects',
    label: 'Projects',
    heading: 'Projects',
    hint: 'Things you built on your own. Add a live link or the repository.',
    icon: FolderGit2,
  },
  {
    id: 'education',
    label: 'Education',
    heading: 'Education',
    hint: 'Degrees, schools and anything worth highlighting from your studies.',
    icon: GraduationCap,
  },
  {
    id: 'skills',
    label: 'Skills',
    heading: 'Skills',
    hint: 'Group related skills under a category so they read cleanly on the page.',
    icon: Zap,
  },
  {
    id: 'certifications',
    label: 'Certifications',
    heading: 'Certifications',
    hint: 'Courses and credentials, with a link if you have one.',
    icon: Award,
  },
  {
    id: 'custom',
    label: 'Custom sections',
    heading: 'Custom sections',
    hint: 'Languages, volunteering, awards — anything the standard sections miss.',
    icon: LayoutGrid,
  },
]

export const TEMPLATES: {
  id: TemplateType
  name: string
  desc: string
  tint: string
}[] = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Accent rule, clear hierarchy. Reads well on screen.',
    tint: 'var(--brand-teal)',
  },
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Centred header and ruled section titles. Formal.',
    tint: 'var(--brand-coral)',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'No ornament. Whitespace and your words only.',
    tint: 'var(--brand-amber)',
  },
]

/** How many entries each section currently holds — drives the nav badges. */
export function getSectionCounts(data: CVData): Record<string, number> {
  const personalFilled = Object.values(data.personalInfo).filter(
    (value) => value.trim().length > 0,
  ).length

  return {
    personal: personalFilled,
    experience: data.experience.length,
    projects: data.projects.length,
    education: data.education.length,
    skills: data.skills.length,
    certifications: data.certifications.length,
    custom: data.customSections.length,
  }
}

/** Rough "how far along am I" signal for the header progress bar. */
export function getCompletion(data: CVData): number {
  const checks = [
    data.personalInfo.fullName.trim().length > 0,
    data.personalInfo.email.trim().length > 0,
    data.personalInfo.summary.trim().length > 0,
    data.experience.length > 0,
    data.education.length > 0,
    data.skills.length > 0,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function isCVEmpty(data: CVData): boolean {
  return (
    getCompletion(data) === 0 &&
    data.projects.length === 0 &&
    data.certifications.length === 0 &&
    data.customSections.length === 0
  )
}
