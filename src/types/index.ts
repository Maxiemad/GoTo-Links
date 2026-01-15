export type BlockType = 
  | 'link' 
  | 'retreat' 
  | 'book-call' 
  | 'whatsapp' 
  | 'telegram' 
  | 'testimonial'

export interface ProfileBlock {
  id: string
  type: BlockType
  order: number
  data: {
    title?: string
    url?: string
    dateRange?: string
    location?: string
    name?: string
    quote?: string
    phone?: string
  }
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  handle: string
  plan: 'free' | 'pro'
}

export interface Profile {
  id: string
  userId: string
  name: string
  headline: string
  bio: string
  photoUrl?: string
  location?: string
  theme: keyof typeof import('../styles/theme').themes
  blocks: ProfileBlock[]
  createdAt: string
  updatedAt: string
}

export interface Stats {
  profileViews: number
  linkClicks: number
  topClickedLink: {
    title: string
    clicks: number
  }
  period: '7d' | '30d' | 'all'
}

export interface Theme {
  name: string
  primary: string
  secondary: string
  background: string | string[]
  text: string
  accent: string
}

