import type { Metadata } from 'next'
import { BuilderShell } from '@/components/builder/builder-shell'

export const metadata: Metadata = {
  title: 'CV builder',
  description: 'Fill in your details, enhance them with AI and preview your CV live.',
}

export default function BuilderPage() {
  return <BuilderShell />
}
