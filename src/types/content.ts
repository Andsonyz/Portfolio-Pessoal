export interface Project {
  id: string
  title: string
  category: string
  description: string
  technologies: string[]
  highlights: string[]
  detailsSections?: { title: string; items: string[] }[]
  image: string
  imageAlt: string
  imageWidth?: number
  imageHeight?: number
  imageCaption?: string
  repository?: string
  liveUrl?: string
}

export interface Certification {
  id: string
  name: string
  institution: string
  date: string
  hours?: number
  category: string
  pdf?: string
  validationUrl?: string
}

export type MilestoneCategory =
  'Formação' | 'Projeto' | 'Experiência' | 'Evento' | 'Certificação' | 'Conquista'
export interface Milestone {
  id: string
  date: string
  title: string
  description: string
  category: MilestoneCategory
}

export interface PortfolioEvent {
  id: string
  name: string
  date: string
  institution: string
  location: string
  description: string
  participation: string
  certificate?: string
}
