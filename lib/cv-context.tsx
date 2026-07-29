'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { CVContextType, CVData, ExperienceEntry, EducationEntry, ProjectEntry, SkillEntry, CertificationEntry, CustomSection, PersonalInfo, TemplateType, Typography } from './types'

const defaultCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  experience: [],
  projects: [],
  education: [],
  skills: [],
  certifications: [],
  customSections: [],
}

/**
 * A CV saved before a field existed is missing it entirely — an older record has
 * no `projects` array and no profile links, and `data.projects.length` on
 * undefined takes the whole builder down on load. Everything read back from
 * storage goes through here rather than being trusted to match the current type.
 */
function withDefaults(saved: unknown): CVData {
  const data = (saved ?? {}) as Partial<CVData>
  return {
    ...defaultCVData,
    ...data,
    personalInfo: { ...defaultCVData.personalInfo, ...(data.personalInfo ?? {}) },
    experience: (data.experience ?? []).map((entry) => ({
      ...entry,
      companyUrl: entry.companyUrl ?? '',
      technologies: entry.technologies ?? '',
    })),
    projects: data.projects ?? [],
    education: data.education ?? [],
    skills: data.skills ?? [],
    certifications: data.certifications ?? [],
    customSections: data.customSections ?? [],
  }
}

/**
 * Type controls, one per role rather than one for the document. Each value
 * multiplies the size the template already uses, so the template keeps its own
 * proportions — pushing "Dates" down does not drag the headings with it.
 */
export const TYPOGRAPHY_DEFAULT: Typography = {
  name: 1,
  links: 1,
  summary: 1,
  sectionTitle: 1,
  entryTitle: 1,
  body: 1,
  dates: 1,
  lineHeight: 1.5,
}

export const TYPOGRAPHY_FIELDS: { key: keyof Typography; label: string }[] = [
  { key: 'name', label: 'Full name' },
  { key: 'links', label: 'Contact links' },
  { key: 'sectionTitle', label: 'Section titles' },
  { key: 'entryTitle', label: 'Job & project titles' },
  { key: 'summary', label: 'Summary' },
  { key: 'body', label: 'Descriptions' },
  { key: 'dates', label: 'Dates' },
]

export const SCALE_RANGE = { min: 0.8, max: 1.4, step: 0.05 } as const
export const LINE_HEIGHT_RANGE = { min: 1.15, max: 2, step: 0.05 } as const

const CVContext = createContext<CVContextType | undefined>(undefined)

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [cvData, setCVData] = useState<CVData>(defaultCVData)
  const [template, setTemplate] = useState<TemplateType>('modern')
  const [typography, setTypographyState] = useState<Typography>(TYPOGRAPHY_DEFAULT)
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [isHydrated, setIsHydrated] = useState(false)

  const setTypography = useCallback((patch: Partial<Typography>) => {
    setTypographyState((prev) => {
      const next = { ...prev, ...patch }
      // Clamped and rounded: stepping by 0.05 repeatedly drifts into
      // 0.9000000000000001, which would leave the min/max guards never quite met.
      for (const key of Object.keys(next) as (keyof Typography)[]) {
        const range = key === 'lineHeight' ? LINE_HEIGHT_RANGE : SCALE_RANGE
        const clamped = Math.min(range.max, Math.max(range.min, next[key]))
        next[key] = Math.round(clamped * 100) / 100
      }
      return next
    })
  }, [])

  const resetTypography = useCallback(() => setTypographyState(TYPOGRAPHY_DEFAULT), [])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cv-data')
    const savedTemplate = localStorage.getItem('cv-template')
    const savedTypography = localStorage.getItem('cv-typography')
    if (saved) {
      try {
        setCVData(withDefaults(JSON.parse(saved)))
      } catch (e) {
        console.error('[v0] Error parsing saved CV data:', e)
      }
    }
    if (savedTemplate) {
      setTemplate(savedTemplate as TemplateType)
    }
    if (savedTypography) {
      try {
        setTypography(JSON.parse(savedTypography))
      } catch {
        // A corrupt entry just means the defaults stand.
      }
    }
    setIsHydrated(true)
  }, [setTypography])

  // Auto-save to localStorage
  useEffect(() => {
    if (!isHydrated) return
    const timer = setTimeout(() => {
      localStorage.setItem('cv-data', JSON.stringify(cvData))
    }, 1000)
    return () => clearTimeout(timer)
  }, [cvData, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem('cv-template', template)
  }, [template, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem('cv-typography', JSON.stringify(typography))
  }, [typography, isHydrated])

  const updatePersonalInfo = useCallback((data: Partial<PersonalInfo>) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data },
    }))
  }, [])

  const addExperience = useCallback((entry: ExperienceEntry) => {
    setCVData((prev) => ({
      ...prev,
      experience: [...prev.experience, entry],
    }))
  }, [])

  const updateExperience = useCallback((id: string, data: Partial<ExperienceEntry>) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, ...data } : exp)),
    }))
  }, [])

  const deleteExperience = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }, [])

  const addProject = useCallback((entry: ProjectEntry) => {
    setCVData((prev) => ({ ...prev, projects: [...prev.projects, entry] }))
  }, [])

  const updateProject = useCallback((id: string, data: Partial<ProjectEntry>) => {
    setCVData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === id ? { ...item, ...data } : item)),
    }))
  }, [])

  const deleteProject = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }))
  }, [])

  const addEducation = useCallback((entry: EducationEntry) => {
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, entry],
    }))
  }, [])

  const updateEducation = useCallback((id: string, data: Partial<EducationEntry>) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...data } : edu)),
    }))
  }, [])

  const deleteEducation = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }, [])

  const addSkill = useCallback((entry: SkillEntry) => {
    setCVData((prev) => ({
      ...prev,
      skills: [...prev.skills, entry],
    }))
  }, [])

  const updateSkill = useCallback((id: string, data: Partial<SkillEntry>) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) => (skill.id === id ? { ...skill, ...data } : skill)),
    }))
  }, [])

  const deleteSkill = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }))
  }, [])

  const addCertification = useCallback((entry: CertificationEntry) => {
    setCVData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, entry],
    }))
  }, [])

  const updateCertification = useCallback((id: string, data: Partial<CertificationEntry>) => {
    setCVData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) => (cert.id === id ? { ...cert, ...data } : cert)),
    }))
  }, [])

  const deleteCertification = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }))
  }, [])

  const addCustomSection = useCallback((section: CustomSection) => {
    setCVData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, section],
    }))
  }, [])

  const updateCustomSection = useCallback((id: string, data: Partial<CustomSection>) => {
    setCVData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) => (section.id === id ? { ...section, ...data } : section)),
    }))
  }, [])

  const deleteCustomSection = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((section) => section.id !== id),
    }))
  }, [])

  const loadFromStorage = useCallback(() => {
    const saved = localStorage.getItem('cv-data')
    if (saved) {
      try {
        setCVData(withDefaults(JSON.parse(saved)))
      } catch (e) {
        console.error('[v0] Error loading CV data:', e)
      }
    }
  }, [])

  const saveToStorage = useCallback(() => {
    localStorage.setItem('cv-data', JSON.stringify(cvData))
  }, [cvData])

  const reset = useCallback(() => {
    setCVData(defaultCVData)
    setTemplate('modern')
    setTypographyState(TYPOGRAPHY_DEFAULT)
    localStorage.removeItem('cv-data')
    localStorage.removeItem('cv-template')
    localStorage.removeItem('cv-typography')
  }, [])

  const value: CVContextType = {
    cvData,
    template,
    setTemplate,
    typography,
    setTypography,
    resetTypography,
    activeSection,
    setActiveSection,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    deleteExperience,
    addProject,
    updateProject,
    deleteProject,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    addCertification,
    updateCertification,
    deleteCertification,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection,
    loadFromStorage,
    saveToStorage,
    reset,
  }

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>
}

export function useCV() {
  const context = useContext(CVContext)
  if (!context) {
    throw new Error('useCV must be used within CVProvider')
  }
  return context
}
