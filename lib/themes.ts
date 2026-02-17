// Theme Configuration System for GoToLinks
// Each theme controls: background, text, cards, buttons, accents

export interface ThemeConfig {
  id: string
  name: string
  description: string
  // Background
  background: string
  backgroundGradient?: string
  // Text
  textPrimary: string
  textSecondary: string
  // Cards
  cardBackground: string
  cardBorder: string
  cardShadow: string
  // Buttons/Links
  buttonPrimary: string
  buttonPrimaryText: string
  buttonHover: string
  // Accents
  accent: string
  accentLight: string
  // Profile header
  headerGradient?: string
  avatarBorder: string
}

export const themes: Record<string, ThemeConfig> = {
  'zen-minimal': {
    id: 'zen-minimal',
    name: 'Zen Minimal',
    description: 'Clean, minimal white aesthetic',
    background: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    cardBackground: '#F9FAFB',
    cardBorder: '#E5E7EB',
    cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    buttonPrimary: '#1F2937',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#374151',
    accent: '#1F2937',
    accentLight: '#F3F4F6',
    avatarBorder: '#E5E7EB',
  },
  'sacred-earth': {
    id: 'sacred-earth',
    name: 'Sacred Earth',
    description: 'Warm, earthy tones',
    background: '#F5E6D3',
    backgroundGradient: 'linear-gradient(180deg, #F5E6D3 0%, #E8D5C4 100%)',
    textPrimary: '#3A2F2F',
    textSecondary: '#5C4D4D',
    cardBackground: '#FDF8F3',
    cardBorder: '#D4C4B0',
    cardShadow: '0 4px 6px -1px rgba(58, 47, 47, 0.1)',
    buttonPrimary: '#A67C52',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#8B6544',
    accent: '#A67C52',
    accentLight: '#F5E6D3',
    headerGradient: 'linear-gradient(135deg, #A67C52 0%, #8B6544 100%)',
    avatarBorder: '#A67C52',
  },
  'ocean-temple': {
    id: 'ocean-temple',
    name: 'Ocean Temple',
    description: 'Calm, oceanic blues',
    background: '#E8F4F8',
    backgroundGradient: 'linear-gradient(180deg, #E8F4F8 0%, #D1E9F0 100%)',
    textPrimary: '#164E63',
    textSecondary: '#0E7490',
    cardBackground: '#F0F9FF',
    cardBorder: '#BAE6FD',
    cardShadow: '0 4px 6px -1px rgba(22, 78, 99, 0.1)',
    buttonPrimary: '#0891B2',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#0E7490',
    accent: '#0891B2',
    accentLight: '#E0F2FE',
    headerGradient: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
    avatarBorder: '#0891B2',
  },
  'forest-calm': {
    id: 'forest-calm',
    name: 'Forest Calm',
    description: 'Peaceful forest greens',
    background: '#ECFDF5',
    backgroundGradient: 'linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%)',
    textPrimary: '#065F46',
    textSecondary: '#047857',
    cardBackground: '#F0FDF4',
    cardBorder: '#A7F3D0',
    cardShadow: '0 4px 6px -1px rgba(6, 95, 70, 0.1)',
    buttonPrimary: '#059669',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#047857',
    accent: '#059669',
    accentLight: '#D1FAE5',
    headerGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    avatarBorder: '#059669',
  },
  'sunset-glow': {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm sunset oranges',
    background: '#FFF7ED',
    backgroundGradient: 'linear-gradient(180deg, #FFF7ED 0%, #FFEDD5 100%)',
    textPrimary: '#9A3412',
    textSecondary: '#C2410C',
    cardBackground: '#FFFBF5',
    cardBorder: '#FED7AA',
    cardShadow: '0 4px 6px -1px rgba(154, 52, 18, 0.1)',
    buttonPrimary: '#EA580C',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#C2410C',
    accent: '#EA580C',
    accentLight: '#FFEDD5',
    headerGradient: 'linear-gradient(135deg, #EA580C 0%, #DC2626 100%)',
    avatarBorder: '#EA580C',
  },
  'lavender-dreams': {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    description: 'Soft purple lavender',
    background: '#FAF5FF',
    backgroundGradient: 'linear-gradient(180deg, #FAF5FF 0%, #F3E8FF 100%)',
    textPrimary: '#581C87',
    textSecondary: '#7C3AED',
    cardBackground: '#FDF4FF',
    cardBorder: '#E9D5FF',
    cardShadow: '0 4px 6px -1px rgba(88, 28, 135, 0.1)',
    buttonPrimary: '#9333EA',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#7C3AED',
    accent: '#9333EA',
    accentLight: '#F3E8FF',
    headerGradient: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
    avatarBorder: '#9333EA',
  },
  'midnight-bloom': {
    id: 'midnight-bloom',
    name: 'Midnight Bloom',
    description: 'Deep, luxurious dark theme',
    background: '#1E1B2E',
    backgroundGradient: 'linear-gradient(180deg, #1E1B2E 0%, #2D2640 100%)',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    cardBackground: '#2D2640',
    cardBorder: '#4C3D6E',
    cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    buttonPrimary: '#A855F7',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#9333EA',
    accent: '#A855F7',
    accentLight: '#3D2D5E',
    headerGradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    avatarBorder: '#A855F7',
  },
  'rose-quartz': {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    description: 'Soft, romantic pinks',
    background: '#FFF1F2',
    backgroundGradient: 'linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 100%)',
    textPrimary: '#9F1239',
    textSecondary: '#BE185D',
    cardBackground: '#FFF5F6',
    cardBorder: '#FECDD3',
    cardShadow: '0 4px 6px -1px rgba(159, 18, 57, 0.1)',
    buttonPrimary: '#E11D48',
    buttonPrimaryText: '#FFFFFF',
    buttonHover: '#BE185D',
    accent: '#E11D48',
    accentLight: '#FFE4E6',
    headerGradient: 'linear-gradient(135deg, #E11D48 0%, #BE185D 100%)',
    avatarBorder: '#E11D48',
  },
}

// Get theme by ID with fallback
export function getTheme(themeId: string | null | undefined): ThemeConfig {
  return themes[themeId || 'zen-minimal'] || themes['zen-minimal']
}

// Get all themes as array for selection UI
export function getThemeList(): ThemeConfig[] {
  return Object.values(themes)
}

// Theme preview colors for selector
export function getThemePreviewColors(themeId: string): { bg: string; accent: string } {
  const theme = getTheme(themeId)
  return {
    bg: theme.background,
    accent: theme.buttonPrimary,
  }
}
