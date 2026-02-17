import React from 'react'
import { colors, borderRadius } from '../styles/theme'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ label, error, style, className, ...props }) => {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: colors.text.primary,
            transition: 'color 0.3s ease',
          }}
        >
          {label}
        </label>
      )}
      <input
        className={className}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          border: `2px solid ${error ? colors.error : colors.gray[300]}`,
          borderRadius: borderRadius.lg,
          backgroundColor: colors.white,
          color: colors.text.primary,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.primary[500]
          e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}, 0 4px 12px rgba(0,0,0,0.08)`
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? colors.error : colors.gray[300]
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
        onMouseEnter={(e) => {
          if (e.currentTarget !== document.activeElement) {
            e.currentTarget.style.borderColor = colors.primary[400]
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
          }
        }}
        onMouseLeave={(e) => {
          if (e.currentTarget !== document.activeElement) {
            e.currentTarget.style.borderColor = error ? colors.error : colors.gray[300]
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
          }
        }}
        {...props}
      />
      {error && (
        <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: colors.error }}>
          {error}
        </p>
      )}
    </div>
  )
}

