import React from 'react'
import { Link } from 'react-router-dom'
import { colors, borderRadius, shadows } from '../styles/theme'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  style?: React.CSSProperties
  to?: string
  as?: 'button' | 'link'
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void
  onMouseUp?: (e: React.MouseEvent<HTMLElement>) => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  style,
  to,
  as,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    borderRadius: borderRadius.xl,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    ...style,
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.accent[500], // Muted Gold for CTAs
      color: colors.white,
      boxShadow: shadows.md,
    },
    secondary: {
      background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
      color: colors.white,
      boxShadow: shadows.md,
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.accent[500],
      border: `2px solid ${colors.accent[500]}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.text.primary,
    },
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
    },
    md: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
    },
  }

  const hoverStyles: React.CSSProperties = {
    transform: 'translateY(-2px)',
    boxShadow: shadows.lg,
  }

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (variant !== 'ghost') {
      Object.assign(e.currentTarget.style, hoverStyles)
    }
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (variant !== 'ghost') {
      e.currentTarget.style.transform = ''
      e.currentTarget.style.boxShadow = variantStyles[variant].boxShadow || ''
    }
    onMouseLeave?.(e)
  }

  // If 'to' prop is provided, render as Link
  if (to) {
    const { onClick, type, disabled, ...linkProps } = props as any
    return (
      <Link
        to={to}
        style={{
          ...combinedStyles,
          ...(disabled ? { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } : {}),
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
        {...linkProps}
      >
        {children}
      </Link>
    )
  }

  // Otherwise render as button
  return (
    <button
      style={combinedStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      {...props}
    >
      {children}
    </button>
  )
}

