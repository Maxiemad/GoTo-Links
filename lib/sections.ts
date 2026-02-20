// Mini Website Sections System - GoToLinks Micro-Site Engine
// Extends profiles with structured content sections

// ============================================
// SECTION TYPES
// ============================================

export type SectionType = 
  | 'about'
  | 'retreat'
  | 'gallery'
  | 'video'
  | 'testimonials'

// ============================================
// SECTION DATA INTERFACES
// ============================================

export interface AboutSectionData {
  title: string
  description: string
  highlightQuote?: string
}

export interface RetreatSectionData {
  eventTitle: string
  location: string
  date: string
  description: string
  ctaText: string
  ctaUrl: string
  showCountdown: boolean
}

export interface GalleryImage {
  url: string
  caption?: string
}

export interface GallerySectionData {
  images: GalleryImage[]
  layout: 'slider' | 'grid'
}

export interface VideoSectionData {
  youtubeUrl: string
  title?: string
  description?: string
}

export interface Testimonial {
  id: string
  name: string
  quote: string
  image?: string
  rating?: number
}

export interface TestimonialsSectionData {
  testimonials: Testimonial[]
  autoSlide: boolean
}

// Union type for all section data
export type SectionData = 
  | AboutSectionData 
  | RetreatSectionData 
  | GallerySectionData 
  | VideoSectionData 
  | TestimonialsSectionData

// ============================================
// SECTION STRUCTURE
// ============================================

export interface Section {
  id: string
  type: SectionType
  data: SectionData
  order: number
  enabled: boolean
  createdAt?: Date
  updatedAt?: Date
}

// ============================================
// SECTION METADATA
// ============================================

export interface SectionMeta {
  type: SectionType
  name: string
  description: string
  icon: string
  defaultData: SectionData
}

export const sectionMeta: Record<SectionType, SectionMeta> = {
  about: {
    type: 'about',
    name: 'About Me',
    description: 'Tell your story with an expandable card',
    icon: '👤',
    defaultData: {
      title: 'About Me',
      description: 'Share your journey, passion, and what drives you.',
      highlightQuote: '',
    } as AboutSectionData,
  },
  retreat: {
    type: 'retreat',
    name: 'Upcoming Event',
    description: 'Highlight your next retreat or event',
    icon: '📅',
    defaultData: {
      eventTitle: 'Sacred Soul Retreat',
      location: 'Ubud, Bali',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Join us for a transformative journey of self-discovery.',
      ctaText: 'Reserve Your Spot',
      ctaUrl: '#',
      showCountdown: true,
    } as RetreatSectionData,
  },
  gallery: {
    type: 'gallery',
    name: 'Image Gallery',
    description: 'Showcase photos in a slider or grid',
    icon: '🖼️',
    defaultData: {
      images: [],
      layout: 'slider',
    } as GallerySectionData,
  },
  video: {
    type: 'video',
    name: 'YouTube Video',
    description: 'Embed a YouTube video',
    icon: '🎥',
    defaultData: {
      youtubeUrl: '',
      title: '',
      description: '',
    } as VideoSectionData,
  },
  testimonials: {
    type: 'testimonials',
    name: 'Testimonials',
    description: 'Social proof carousel',
    icon: '💬',
    defaultData: {
      testimonials: [],
      autoSlide: true,
    } as TestimonialsSectionData,
  },
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createSection(type: SectionType, order: number): Section {
  return {
    id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    data: { ...sectionMeta[type].defaultData },
    order,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export function getSectionMeta(type: SectionType): SectionMeta {
  return sectionMeta[type]
}

export function getAllSectionTypes(): SectionMeta[] {
  return Object.values(sectionMeta)
}

// Type guards
export function isAboutSection(data: SectionData): data is AboutSectionData {
  return 'description' in data && 'title' in data && !('eventTitle' in data)
}

export function isRetreatSection(data: SectionData): data is RetreatSectionData {
  return 'eventTitle' in data && 'location' in data
}

export function isGallerySection(data: SectionData): data is GallerySectionData {
  return 'images' in data && 'layout' in data
}

export function isVideoSection(data: SectionData): data is VideoSectionData {
  return 'youtubeUrl' in data
}

export function isTestimonialsSection(data: SectionData): data is TestimonialsSectionData {
  return 'testimonials' in data && 'autoSlide' in data
}
