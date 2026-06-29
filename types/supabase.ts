export type Experience = {
  id: string
  title: string
  company: string
  location: string
  period: string
  accent: string
  bullets: string[]
  sort_order: number
}

export type Education = {
  id: string
  degree: string
  institution: string
  year: string
  certifications: string[]
}

export type Project = {
  id: string
  slug: string
  case_study_number: string
  tagline: string
  accent: 'coral' | 'marigold' | 'periwinkle' | 'mint'
  tech: string[]
  sort_order: number
}

export type Community = {
  id: string
  name: string
  description: string
  href: string
  accent: string
  sort_order: number
}
