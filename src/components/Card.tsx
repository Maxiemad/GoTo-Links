import React from 'react'
import { colors, borderRadius, shadows } from '../styles/theme'

interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, style, className, onClick }) => {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        backgroundColor: colors.white,
        borderRadius: borderRadius['2xl'],
        padding: '1.5rem',
        boxShadow: shadows.lg,
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = shadows.xl
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = shadows.lg
        }
      }}
    >
      {children}
    </div>
  )
}

