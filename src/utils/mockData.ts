import { User, Profile, Stats } from '../types'

export const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  firstName: 'Sarah',
  lastName: 'Moon',
  handle: 'demo-creator',
  plan: 'free',
}

export const mockProfile: Profile = {
  id: '1',
  userId: '1',
  name: 'Sarah Moon',
  headline: 'Retreat Leader & Sacred Space Holder',
  bio: 'Creating transformative experiences in nature. Join me for healing retreats, meditation circles, and soulful gatherings.',
  photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  location: 'Bali, Indonesia',
  theme: 'mystic-teal-gold',
  blocks: [
    {
      id: '1',
      type: 'retreat',
      order: 0,
      data: {
        title: 'Sacred Silence Retreat',
        dateRange: 'March 15-20, 2024',
        location: 'Ubud, Bali',
        url: 'https://example.com/retreat1',
      },
    },
    {
      id: '2',
      type: 'link',
      order: 1,
      data: {
        title: 'My Wellness Blog',
        url: 'https://example.com/blog',
      },
    },
    {
      id: '3',
      type: 'book-call',
      order: 2,
      data: {
        title: 'Book a Discovery Call',
        url: 'https://calendly.com/sarah-moon',
      },
    },
    {
      id: '4',
      type: 'testimonial',
      order: 3,
      data: {
        name: 'Emma K.',
        quote: 'Sarah\'s retreats changed my life. The space she creates is truly magical.',
      },
    },
  ],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
}

export const mockStats: Stats = {
  profileViews: 342,
  linkClicks: 128,
  topClickedLink: {
    title: 'Sacred Silence Retreat',
    clicks: 45,
  },
  period: '7d',
}

// Mock API functions
export const mockApi = {
  getUser: async (): Promise<User> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockUser), 300))
  },
  
  getProfile: async (handle: string): Promise<Profile | null> => {
    if (handle === 'demo-creator') {
      return new Promise((resolve) => setTimeout(() => resolve(mockProfile), 300))
    }
    return null
  },
  
  getStats: async (): Promise<Stats> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockStats), 300))
  },
  
  updateProfile: async (profile: Partial<Profile>): Promise<Profile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updated = { ...mockProfile, ...profile, updatedAt: new Date().toISOString() }
        resolve(updated)
      }, 500)
    })
  },
}

