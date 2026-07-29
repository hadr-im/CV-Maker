import type { CVData } from './types'

/**
 * Stand-in CV for the template previews on the marketing page. It exists so the
 * thumbnails can render the real template components rather than an abstract
 * imitation of them — whatever a template does to a heading or a date column,
 * the preview shows it, and it cannot drift out of step.
 *
 * Deliberately short: the thumbnails crop partway down the page, so anything
 * past the first experience entry is never seen. Dates are pre-formatted here
 * because `formatRange` concatenates the strings as given.
 */
export const SAMPLE_CV: CVData = {
  personalInfo: {
    fullName: 'Amina Cherif',
    email: 'amina.cherif@email.com',
    phone: '+213 555 01 42 88',
    location: 'Algiers',
    linkedin: 'https://linkedin.com/in/example',
    github: 'https://github.com/example',
    portfolio: 'https://example.dev',
    summary:
      'Front-end engineer with six years building fast, accessible interfaces. Comfortable owning a feature from design hand-off through to production.',
  },
  experience: [
    {
      id: 'sample-x1',
      title: 'Senior Front-end Engineer',
      company: 'Groupe Voyages',
      companyUrl: 'https://example.com',
      startDate: 'Mar 2022',
      endDate: '',
      isCurrent: true,
      description:
        'Rebuilt the booking flow and cut time to first render by 40%.\nMentored three engineers and set the review standards the team still uses.',
      technologies: 'React, Next.js, TypeScript, PostgreSQL',
    },
    {
      id: 'sample-x2',
      title: 'Front-end Developer',
      company: 'Tech Everest',
      companyUrl: '',
      startDate: 'Sep 2019',
      endDate: 'Feb 2022',
      isCurrent: false,
      description: 'Shipped the design system now used across four internal products.',
      technologies: 'React, Storybook, Tailwind CSS',
    },
  ],
  projects: [
    {
      id: 'sample-p1',
      name: 'Surplus',
      url: 'https://example.dev/surplus',
      repoUrl: 'https://github.com/example/surplus',
      date: 'Nov 2025',
      description:
        'Platform connecting shoppers with local businesses to rescue surplus food, with role-based access.',
      technologies: 'Next.js, .NET Core, MySQL, JWT',
    },
  ],
  education: [
    {
      id: 'sample-e1',
      school: 'USTHB',
      degree: 'MSc Computer Science',
      field: 'Software Engineering',
      startDate: 'Sep 2017',
      endDate: 'Jun 2019',
      details: '',
    },
  ],
  skills: [
    { id: 'sample-s1', category: 'Languages', skills: ['TypeScript', 'Python', 'SQL'] },
    { id: 'sample-s2', category: 'Frameworks', skills: ['React', 'Next.js', 'Tailwind CSS'] },
  ],
  certifications: [],
  customSections: [],
}
