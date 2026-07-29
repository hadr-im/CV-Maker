export type TemplateType = 'modern' | 'classic' | 'minimal'

/**
 * Per-role type controls. Each value is a multiplier on whatever size the
 * template already uses for that role, so a template keeps its own proportions
 * and the reader can still push one role up or down. `lineHeight` is absolute.
 */
export interface Typography {
  name: number
  links: number
  summary: number
  sectionTitle: number
  entryTitle: number
  body: number
  dates: number
  lineHeight: number
}

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  summary: string
}

export interface ExperienceEntry {
  id: string
  title: string
  company: string
  /** Company website. Makes the company name a link in the exported CV. */
  companyUrl: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
  /** Free-text stack line, rendered under the bullets. */
  technologies: string
}

export interface ProjectEntry {
  id: string
  name: string
  /** Live/hosted URL. */
  url: string
  /** Source repository. */
  repoUrl: string
  date: string
  description: string
  technologies: string
}

export interface EducationEntry {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  details: string
}

export interface SkillEntry {
  id: string
  category: string
  skills: string[]
}

export interface CertificationEntry {
  id: string
  name: string
  issuer: string
  date: string
  credentialUrl: string
}

export interface CustomSection {
  id: string
  title: string
  content: string
}

export interface CVData {
  personalInfo: PersonalInfo
  experience: ExperienceEntry[]
  projects: ProjectEntry[]
  education: EducationEntry[]
  skills: SkillEntry[]
  certifications: CertificationEntry[]
  customSections: CustomSection[]
}

export interface CVContextType {
  cvData: CVData
  template: TemplateType
  setTemplate: (template: TemplateType) => void
  typography: Typography
  setTypography: (patch: Partial<Typography>) => void
  resetTypography: () => void
  activeSection: string
  setActiveSection: (section: string) => void
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void
  addExperience: (entry: ExperienceEntry) => void
  updateExperience: (id: string, data: Partial<ExperienceEntry>) => void
  deleteExperience: (id: string) => void
  addProject: (entry: ProjectEntry) => void
  updateProject: (id: string, data: Partial<ProjectEntry>) => void
  deleteProject: (id: string) => void
  addEducation: (entry: EducationEntry) => void
  updateEducation: (id: string, data: Partial<EducationEntry>) => void
  deleteEducation: (id: string) => void
  addSkill: (entry: SkillEntry) => void
  updateSkill: (id: string, data: Partial<SkillEntry>) => void
  deleteSkill: (id: string) => void
  addCertification: (entry: CertificationEntry) => void
  updateCertification: (id: string, data: Partial<CertificationEntry>) => void
  deleteCertification: (id: string) => void
  addCustomSection: (section: CustomSection) => void
  updateCustomSection: (id: string, data: Partial<CustomSection>) => void
  deleteCustomSection: (id: string) => void
  loadFromStorage: () => void
  saveToStorage: () => void
  reset: () => void
}
