import React from 'react'
import { colors, borderRadius } from '../styles/theme'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
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
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          border: `2px solid ${error ? colors.error : colors.gray[300]}`,
          borderRadius: borderRadius.lg,
          backgroundColor: colors.white,
          color: colors.text.primary,
          transition: 'all 0.2s ease',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.primary[500]
          e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? colors.error : colors.gray[300]
          e.currentTarget.style.boxShadow = 'none'
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

