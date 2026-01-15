// Wellness color palette - Updated with new brand colors
export const colors = {
  // Primary - Vibrant Coral/Peach
  primary: {
    50: '#FFF4F1',
    100: '#FFE4D9',
    200: '#FFC9B3',
    300: '#FFA88D',
    400: '#FF8A6B',
    500: '#FF7043', // Primary - Vibrant Coral/Peach
    600: '#E85D2E',
    700: '#CC4A1F',
    800: '#B03A15',
    900: '#8B2A0D',
  },
  // Secondary - Soft Blush Pink
  secondary: {
    50: '#FDF2F9',
    100: '#FCE5F3',
    200: '#F9CCE7',
    300: '#F5B3DB',
    400: '#F19ACF',
    500: '#EFBAD6', // Secondary - Soft Blush Pink
    600: '#D99BC0',
    700: '#C37CAA',
    800: '#AD5D94',
    900: '#973E7E',
  },
  // Accent - Muted Gold (for CTAs and brand elements)
  accent: {
    50: '#F5F0EB',
    100: '#E8DDD3',
    200: '#D1BBAA',
    300: '#BA9981',
    400: '#A37758',
    500: '#A18267', // Muted Gold - Accent/CTAs
    600: '#8B6F57',
    700: '#755C47',
    800: '#5F4937',
    900: '#493627',
  },
  // Background - Soft Off-White
  background: '#F5F5F5',
  // Text - Neutral Gray/Charcoal
  text: {
    primary: '#424242', // Main text color
    secondary: '#757575',
    muted: '#9E9E9E',
  },
  // Neutrals
  white: '#FFFFFF',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  // Legacy support (keeping for backward compatibility)
  teal: {
    500: '#FF7043', // Map to primary
    600: '#E85D2E',
  },
  gold: {
    500: '#A18267', // Map to accent
  },
  sage: {
    500: '#EFBAD6', // Map to secondary
  },
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
}

// Theme presets
export const themes = {
  'sacred-earth': {
    name: 'Sacred Earth',
    primary: '#8B6F47',
    secondary: '#D4A574',
    background: '#F5F1EB',
    text: '#3E2723',
    accent: '#C9A961',
  },
  'zen-minimal': {
    name: 'Zen Minimal',
    primary: colors.teal[500],
    secondary: colors.gray[200],
    background: colors.white,
    text: colors.gray[800],
    accent: colors.teal[300],
  },
  'mystic-teal-gold': {
    name: 'Mystic Teal & Gold',
    primary: colors.teal[600],
    secondary: colors.gold[500],
    background: colors.white,
    text: colors.gray[800],
    accent: colors.gold[400],
  },
  'ocean-temple': {
    name: 'Ocean Temple',
    primary: '#0EA5E9',
    secondary: colors.teal[400],
    background: 'linear-gradient(135deg, #E0F2FE 0%, #B3E5FC 100%)',
    text: colors.gray[800],
    accent: colors.teal[500],
  },
}

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    serif: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", // Using Inter for all text
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
}

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
}

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
}

