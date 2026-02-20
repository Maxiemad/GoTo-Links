// Theme Engine 2.0 - GoToLinks Premium Theme System
// Luxury wellness SaaS theming with animations

// ============================================
// TYPE DEFINITIONS
// ============================================

export type BackgroundAnimationType = 
  | 'none'
  | 'floating-particles'
  | 'gradient-shift'
  | 'soft-waves'
  | 'aurora'

export type BlockAnimationType =
  | 'none'
  | 'fadeUp'
  | 'slideIn'
  | 'staggeredAppear'
  | 'softScale'
  | 'floatOnHover'

export type BlockStyleType =
  | 'glassmorphism'
  | 'gradient-pill'
  | 'soft-shadow'
  | 'minimal-underline'
  | 'glow-border'
  | 'solid-card'

export type ProfileImageStyle =
  | 'circle-glow'
  | 'circle-border'
  | 'rounded-square'
  | 'organic-blob'

export interface FontPairing {
  heading: string
  body: string
  headingWeight: number
  bodyWeight: number
}

export interface ThemeConfig {
  // Identity
  id: string
  name: string
  description: string
  category: 'light' | 'dark' | 'colorful'
  
  // Background System
  background: string
  backgroundGradient?: string
  backgroundAnimationType: BackgroundAnimationType
  backgroundAnimationConfig?: {
    particleColor?: string
    particleCount?: number
    gradientColors?: string[]
    speed?: 'slow' | 'medium' | 'fast'
  }
  
  // Typography
  textPrimary: string
  textSecondary: string
  fontPairing: FontPairing
  
  // Cards/Blocks
  cardBackground: string
  cardBorder: string
  cardShadow: string
  blockStyle: BlockStyleType
  blockAnimation: BlockAnimationType
  blockHoverEffect: {
    translateY: number
    scale: number
    shadowIncrease: string
    glowColor?: string
  }
  
  // Buttons
  buttonPrimary: string
  buttonPrimaryText: string
  buttonHover: string
  buttonStyle: 'solid' | 'gradient' | 'outline' | 'glow'
  
  // Accents & Effects
  accent: string
  accentLight: string
  headerGradient?: string
  avatarBorder: string
  profileImageStyle: ProfileImageStyle
  glowAura: {
    enabled: boolean
    color: string
    opacity: number
    blur: number
    animation: 'none' | 'pulse' | 'breathe'
  }
}

// ============================================
// FONT PAIRINGS
// ============================================

export const fontPairings: Record<string, FontPairing> = {
  'elegant-serif': {
    heading: 'Playfair Display',
    body: 'Inter',
    headingWeight: 600,
    bodyWeight: 400,
  },
  'modern-sans': {
    heading: 'Inter',
    body: 'Inter',
    headingWeight: 700,
    bodyWeight: 400,
  },
  'wellness-soft': {
    heading: 'Cormorant Garamond',
    body: 'Nunito',
    headingWeight: 500,
    bodyWeight: 400,
  },
  'minimal-clean': {
    heading: 'DM Sans',
    body: 'DM Sans',
    headingWeight: 600,
    bodyWeight: 400,
  },
  'luxury-display': {
    heading: 'Cormorant',
    body: 'Lato',
    headingWeight: 600,
    bodyWeight: 400,
  },
}

// ============================================
// THEME DEFINITIONS
// ============================================

export const themes: Record<string, ThemeConfig> = {
  'zen-minimal': {
    id: 'zen-minimal',
    name: 'Zen Minimal',
    description: 'Clean, minimal white aesthetic',
    category: 'light',
    
    background: '#FFFFFF',
    backgroundAnimationType: 'none',
    
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    fontPairing: fontPairings['minimal-clean'],
    
    cardBackground: 'rgba(249, 250, 251, 0.8)',
    cardBorder: '#E5E7EB',
    cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
    blockStyle: 'soft-shadow',
    blockAnimation: 'fadeUp',
    blockHoverEffect: {
      translateY: -2,
      scale: 1.01,
      shadowIncrease: '0 8px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    
    buttonPrimary: '#1F2937',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#374151',
    buttonStyle: 'solid',
    
    accent: '#1F2937',
    accentLight: '#F3F4F6',
    avatarBorder: '#E5E7EB',
    profileImageStyle: 'circle-border',
    glowAura: {
      enabled: false,
      color: '#1F2937',
      opacity: 0,
      blur: 0,
      animation: 'none',
    },
  },
  
  'sacred-earth': {
    id: 'sacred-earth',
    name: 'Sacred Earth',
    description: 'Warm, earthy wellness tones',
    category: 'light',
    
    background: '#F5E6D3',
    backgroundGradient: 'linear-gradient(180deg, #F5E6D3 0%, #E8D5C4 100%)',
    backgroundAnimationType: 'floating-particles',
    backgroundAnimationConfig: {
      particleColor: 'rgba(166, 124, 82, 0.15)',
      particleCount: 20,
      speed: 'slow',
    },
    
    textPrimary: '#3A2F2F',
    textSecondary: '#5C4D4D',
    fontPairing: fontPairings['wellness-soft'],
    
    cardBackground: 'rgba(253, 248, 243, 0.9)',
    cardBorder: 'rgba(212, 196, 176, 0.5)',
    cardShadow: '0 4px 20px -2px rgba(58, 47, 47, 0.08)',
    blockStyle: 'glassmorphism',
    blockAnimation: 'staggeredAppear',
    blockHoverEffect: {
      translateY: -3,
      scale: 1.02,
      shadowIncrease: '0 12px 30px -5px rgba(58, 47, 47, 0.15)',
      glowColor: 'rgba(166, 124, 82, 0.2)',
    },
    
    buttonPrimary: '#A67C52',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#8B6544',
    buttonStyle: 'gradient',
    
    accent: '#A67C52',
    accentLight: '#F5E6D3',
    headerGradient: 'linear-gradient(135deg, #A67C52 0%, #8B6544 100%)',
    avatarBorder: '#A67C52',
    profileImageStyle: 'circle-glow',
    glowAura: {
      enabled: true,
      color: '#A67C52',
      opacity: 0.25,
      blur: 60,
      animation: 'breathe',
    },
  },
  
  'ocean-temple': {
    id: 'ocean-temple',
    name: 'Ocean Temple',
    description: 'Calm, oceanic tranquility',
    category: 'light',
    
    background: '#E8F4F8',
    backgroundGradient: 'linear-gradient(180deg, #E8F4F8 0%, #D1E9F0 100%)',
    backgroundAnimationType: 'soft-waves',
    backgroundAnimationConfig: {
      gradientColors: ['#E8F4F8', '#D1E9F0', '#BAE6FD'],
      speed: 'slow',
    },
    
    textPrimary: '#164E63',
    textSecondary: '#0E7490',
    fontPairing: fontPairings['elegant-serif'],
    
    cardBackground: 'rgba(240, 249, 255, 0.85)',
    cardBorder: 'rgba(186, 230, 253, 0.6)',
    cardShadow: '0 4px 20px -2px rgba(22, 78, 99, 0.08)',
    blockStyle: 'glassmorphism',
    blockAnimation: 'slideIn',
    blockHoverEffect: {
      translateY: -2,
      scale: 1.015,
      shadowIncrease: '0 10px 30px -5px rgba(22, 78, 99, 0.12)',
      glowColor: 'rgba(8, 145, 178, 0.15)',
    },
    
    buttonPrimary: '#0891B2',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#0E7490',
    buttonStyle: 'gradient',
    
    accent: '#0891B2',
    accentLight: '#E0F2FE',
    headerGradient: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
    avatarBorder: '#0891B2',
    profileImageStyle: 'circle-glow',
    glowAura: {
      enabled: true,
      color: '#0891B2',
      opacity: 0.2,
      blur: 50,
      animation: 'pulse',
    },
  },
  
  'forest-calm': {
    id: 'forest-calm',
    name: 'Forest Calm',
    description: 'Peaceful forest sanctuary',
    category: 'light',
    
    background: '#ECFDF5',
    backgroundGradient: 'linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%)',
    backgroundAnimationType: 'floating-particles',
    backgroundAnimationConfig: {
      particleColor: 'rgba(5, 150, 105, 0.12)',
      particleCount: 15,
      speed: 'slow',
    },
    
    textPrimary: '#065F46',
    textSecondary: '#047857',
    fontPairing: fontPairings['wellness-soft'],
    
    cardBackground: 'rgba(240, 253, 244, 0.9)',
    cardBorder: 'rgba(167, 243, 208, 0.5)',
    cardShadow: '0 4px 20px -2px rgba(6, 95, 70, 0.08)',
    blockStyle: 'soft-shadow',
    blockAnimation: 'fadeUp',
    blockHoverEffect: {
      translateY: -3,
      scale: 1.02,
      shadowIncrease: '0 12px 30px -5px rgba(6, 95, 70, 0.12)',
      glowColor: 'rgba(5, 150, 105, 0.15)',
    },
    
    buttonPrimary: '#059669',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#047857',
    buttonStyle: 'solid',
    
    accent: '#059669',
    accentLight: '#D1FAE5',
    headerGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    avatarBorder: '#059669',
    profileImageStyle: 'circle-glow',
    glowAura: {
      enabled: true,
      color: '#059669',
      opacity: 0.22,
      blur: 55,
      animation: 'breathe',
    },
  },
  
  'sunset-glow': {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm golden hour radiance',
    category: 'light',
    
    background: '#FFF7ED',
    backgroundGradient: 'linear-gradient(180deg, #FFF7ED 0%, #FFEDD5 100%)',
    backgroundAnimationType: 'gradient-shift',
    backgroundAnimationConfig: {
      gradientColors: ['#FFF7ED', '#FFEDD5', '#FED7AA'],
      speed: 'slow',
    },
    
    textPrimary: '#9A3412',
    textSecondary: '#C2410C',
    fontPairing: fontPairings['elegant-serif'],
    
    cardBackground: 'rgba(255, 251, 245, 0.9)',
    cardBorder: 'rgba(254, 215, 170, 0.5)',
    cardShadow: '0 4px 20px -2px rgba(154, 52, 18, 0.08)',
    blockStyle: 'gradient-pill',
    blockAnimation: 'softScale',
    blockHoverEffect: {
      translateY: -2,
      scale: 1.02,
      shadowIncrease: '0 10px 30px -5px rgba(154, 52, 18, 0.15)',
      glowColor: 'rgba(234, 88, 12, 0.2)',
    },
    
    buttonPrimary: '#EA580C',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#C2410C',
    buttonStyle: 'gradient',
    
    accent: '#EA580C',
    accentLight: '#FFEDD5',
    headerGradient: 'linear-gradient(135deg, #EA580C 0%, #DC2626 100%)',
    avatarBorder: '#EA580C',
    profileImageStyle: 'circle-glow',
    glowAura: {
      enabled: true,
      color: '#EA580C',
      opacity: 0.25,
      blur: 60,
      animation: 'pulse',
    },
  },
  
  'lavender-dreams': {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    description: 'Soft mystical purple haze',
    category: 'light',
    
    background: '#FAF5FF',
    backgroundGradient: 'linear-gradient(180deg, #FAF5FF 0%, #F3E8FF 100%)',
    backgroundAnimationType: 'aurora',
    backgroundAnimationConfig: {
      gradientColors: ['#FAF5FF', '#F3E8FF', '#E9D5FF'],
      speed: 'slow',
    },
    
    textPrimary: '#581C87',
    textSecondary: '#7C3AED',
    fontPairing: fontPairings['luxury-display'],
    
    cardBackground: 'rgba(253, 244, 255, 0.85)',
    cardBorder: 'rgba(233, 213, 255, 0.6)',
    cardShadow: '0 4px 20px -2px rgba(88, 28, 135, 0.08)',
    blockStyle: 'glassmorphism',
    blockAnimation: 'staggeredAppear',
    blockHoverEffect: {
      translateY: -3,
      scale: 1.02,
      shadowIncrease: '0 12px 30px -5px rgba(88, 28, 135, 0.15)',
      glowColor: 'rgba(147, 51, 234, 0.2)',
    },
    
    buttonPrimary: '#9333EA',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#7C3AED',
    buttonStyle: 'glow',
    
    accent: '#9333EA',
    accentLight: '#F3E8FF',
    headerGradient: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
    avatarBorder: '#9333EA',
    profileImageStyle: 'circle-glow',
    glowAura: {
      enabled: true,
      color: '#9333EA',
      opacity: 0.28,
      blur: 65,
      animation: 'breathe',
    },
  },
  
  'midnight-bloom': {
    id: 'midnight-bloom',
    name: 'Midnight Bloom',
    description: 'Deep luxurious night sky',
    category: 'dark',
    
    background: '#1E1B2E',
    backgroundGradient: 'linear-gradient(180deg, #1E1B2E 0%, #2D2640 100%)',
    backgroundAnimationType: 'floating-particles',
    backgroundAnimationConfig: {
      particleColor: 'rgba(168, 85, 247, 0.2)',
      particleCount: 25,
      speed: 'slow',
    },
    
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    fontPairing: fontPairings['luxury-display'],
    
    cardBackground: 'rgba(45, 38, 64, 0.8)',
    cardBorder: 'rgba(76, 61, 110, 0.5)',
    cardShadow: '0 4px 25px -2px rgba(0, 0, 0, 0.4)',
    blockStyle: 'glassmorphism',
    blockAnimation: 'slideIn',
    blockHoverEffect: {
      translateY: -3,
      scale: 1.02,
      shadowIncrease: '0 15px 40px -5px rgba(0, 0, 0, 0.5)',
      glowColor: 'rgba(168, 85, 247, 0.3)',
    },
    
    buttonPrimary: '#A855F7',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#9333EA',
    buttonStyle: 'glow',
    
    accent: '#A855F7',
    accentLight: '#3D2D5E',
    headerGradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    avatarBorder: '#A855F7',
    profileImageStyle: 'circle-glow',
    glowAura: {
      enabled: true,
      color: '#A855F7',
      opacity: 0.35,
      blur: 70,
      animation: 'pulse',
    },
  },
  
  'rose-quartz': {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    description: 'Soft romantic crystal energy',
    category: 'light',
    
    background: '#FFF1F2',
    backgroundGradient: 'linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 100%)',
    backgroundAnimationType: 'floating-particles',
    backgroundAnimationConfig: {
      particleColor: 'rgba(225, 29, 72, 0.1)',
      particleCount: 18,
      speed: 'slow',
    },
    
    textPrimary: '#9F1239',
    textSecondary: '#BE185D',
    fontPairing: fontPairings['elegant-serif'],
    
    cardBackground: 'rgba(255, 245, 246, 0.9)',
    cardBorder: 'rgba(254, 205, 211, 0.5)',
    cardShadow: '0 4px 20px -2px rgba(159, 18, 57, 0.08)',
    blockStyle: 'soft-shadow',
    blockAnimation: 'fadeUp',
    blockHoverEffect: {
      translateY: -2,
      scale: 1.015,
      shadowIncrease: '0 10px 30px -5px rgba(159, 18, 57, 0.12)',
      glowColor: 'rgba(225, 29, 72, 0.15)',
    },
    
    buttonPrimary: '#E11D48',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#BE185D',
    buttonStyle: 'gradient',
    
    accent: '#E11D48',
    accentLight: '#FFE4E6',
    headerGradient: 'linear-gradient(135deg, #E11D48 0%, #BE185D 100%)',
    avatarBorder: '#E11D48',
    profileImageStyle: 'circle-glow',
    glowAura: {
      enabled: true,
      color: '#E11D48',
      opacity: 0.22,
      blur: 55,
      animation: 'breathe',
    },
  },
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getTheme(themeId: string | null | undefined): ThemeConfig {
  return themes[themeId || 'zen-minimal'] || themes['zen-minimal']
}

export function getThemeList(): ThemeConfig[] {
  return Object.values(themes)
}

export function getThemesByCategory(category: 'light' | 'dark' | 'colorful'): ThemeConfig[] {
  return Object.values(themes).filter(t => t.category === category)
}

export function getThemePreviewColors(themeId: string): { bg: string; accent: string } {
  const theme = getTheme(themeId)
  return {
    bg: theme.background,
    accent: theme.buttonPrimary,
  }
}

// CSS Animation keyframes generator
export function getAnimationKeyframes(animationType: BlockAnimationType, index: number = 0): string {
  const delay = index * 0.1
  
  switch (animationType) {
    case 'fadeUp':
      return `
        animation: fadeUp 0.6s ease-out ${delay}s both;
      `
    case 'slideIn':
      return `
        animation: slideIn 0.5s ease-out ${delay}s both;
      `
    case 'staggeredAppear':
      return `
        animation: staggeredAppear 0.7s ease-out ${delay}s both;
      `
    case 'softScale':
      return `
        animation: softScale 0.5s ease-out ${delay}s both;
      `
    case 'floatOnHover':
      return `
        animation: fadeIn 0.4s ease-out ${delay}s both;
        transition: transform 0.3s ease;
      `
    default:
      return ''
  }
}

// Get block style CSS
export function getBlockStyleCSS(style: BlockStyleType, theme: ThemeConfig): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius: '16px',
    padding: '20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }
  
  switch (style) {
    case 'glassmorphism':
      return {
        ...base,
        backgroundColor: theme.cardBackground,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: theme.cardShadow,
      }
    case 'gradient-pill':
      return {
        ...base,
        borderRadius: '50px',
        background: `linear-gradient(135deg, ${theme.cardBackground} 0%, ${theme.accentLight} 100%)`,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: theme.cardShadow,
      }
    case 'soft-shadow':
      return {
        ...base,
        backgroundColor: theme.cardBackground,
        border: 'none',
        boxShadow: theme.cardShadow,
      }
    case 'minimal-underline':
      return {
        ...base,
        backgroundColor: 'transparent',
        borderRadius: '0',
        borderBottom: `2px solid ${theme.cardBorder}`,
        padding: '16px 0',
      }
    case 'glow-border':
      return {
        ...base,
        backgroundColor: theme.cardBackground,
        border: `2px solid ${theme.accent}`,
        boxShadow: `0 0 20px ${theme.blockHoverEffect.glowColor || theme.accent}40`,
      }
    case 'solid-card':
    default:
      return {
        ...base,
        backgroundColor: theme.cardBackground,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: theme.cardShadow,
      }
  }
}

// Export for backwards compatibility
export type { ThemeConfig as ThemeConfigLegacy }
