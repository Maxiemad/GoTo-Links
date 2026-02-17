// GoToLinks Type Definitions

export type BlockType = 
  | 'LINK' 
  | 'RETREAT' 
  | 'BOOK_CALL' 
  | 'WHATSAPP' 
  | 'TELEGRAM' 
  | 'TESTIMONIAL'
  | 'SOCIAL'

export type Plan = 'FREE' | 'PRO'

export type AuthProvider = 'EMAIL' | 'GOOGLE'

export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  handle: string
  plan: Plan
  picture: string | null
  authProvider: AuthProvider
}

export interface Profile {
  id: string
  userId: string
  name: string
  headline: string | null
  bio: string | null
  photoUrl: string | null
  videoUrl: string | null
  location: string | null
  theme: string
  customDomain: string | null
  blocks: Block[]
}

export interface Block {
  id: string
  profileId: string
  type: BlockType
  order: number
  isVisible: boolean
  title: string | null
  url: string | null
  description: string | null
  // Retreat
  dateRange: string | null
  location: string | null
  price: number | null
  // Testimonial
  authorName: string | null
  authorPhoto: string | null
  quote: string | null
  // Contact
  phone: string | null
}

export interface Stats {
  profileViews: number
  linkClicks: number
  topClickedLink: {
    title: string
    clicks: number
  } | null
  period: '7d' | '30d' | 'all'
}

export interface Theme {
  id: string
  name: string
  primary: string
  secondary: string
  background: string
  text: string
  accent: string
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface AuthResponse {
  user: User
  sessionToken?: string
}

export interface ProfileResponse {
  profile: Profile
  user: User
}
