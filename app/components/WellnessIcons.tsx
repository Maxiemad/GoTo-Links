import React from 'react'
import { colors } from '../styles/theme'

interface IconProps {
  size?: number
  color?: string
  className?: string
}

export const EyeIcon: React.FC<IconProps> = ({ size = 24, color = colors.primary[500], className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill={color} opacity="0.3" />
    <circle cx="12" cy="12" r="1.5" fill={color} />
  </svg>
)

export const LinkIcon: React.FC<IconProps> = ({ size = 24, color = colors.secondary[500], className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

export const StarIcon: React.FC<IconProps> = ({ size = 24, color = colors.accent[500], className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={color}
      opacity="0.8"
    />
    <circle cx="12" cy="12" r="2" fill={color} opacity="0.4" />
  </svg>
)

export const EditIcon: React.FC<IconProps> = ({ size = 32, color = colors.primary[500], className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

export const PreviewIcon: React.FC<IconProps> = ({ size = 32, color = colors.secondary[500], className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path
      d="M2 8h20M8 4v4M16 4v4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="14" r="2" fill={color} opacity="0.3" />
    <path
      d="M8 14l2-2 2 2 4-4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

export const SparkleIcon: React.FC<IconProps> = ({ size = 32, color = colors.accent[500], className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      fill={color}
      opacity="0.8"
    />
    <circle cx="6" cy="6" r="1.5" fill={color} opacity="0.6" />
    <circle cx="18" cy="18" r="1.5" fill={color} opacity="0.6" />
    <circle cx="18" cy="6" r="1.5" fill={color} opacity="0.6" />
    <circle cx="6" cy="18" r="1.5" fill={color} opacity="0.6" />
  </svg>
)

export const WelcomeIcon: React.FC<IconProps> = ({ size = 28, color = colors.primary[500], className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill={color} opacity="0.1" />
    <path
      d="M8 12l2 2 6-6"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="1.5" fill={color} />
  </svg>
)
