'use client'

import React from 'react'

interface Icon3DProps {
  size?: number
  className?: string
  style?: React.CSSProperties
}

// 3D Yoga/Meditation Icon
export function YogaIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="yoga-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9A76" />
          <stop offset="100%" stopColor="#FF6B6B" />
        </linearGradient>
        <filter id="yoga-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#FF6B6B" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#yoga-shadow)">
        <circle cx="24" cy="12" r="6" fill="url(#yoga-grad)" />
        <path d="M24 20v10M14 36l10-6 10 6M18 28l6 4 6-4" stroke="url(#yoga-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M12 42c0-6 6-10 12-10s12 4 12 10" stroke="url(#yoga-grad)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
      </g>
    </svg>
  )
}

// 3D Leaf/Nature Icon
export function LeafIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7CB342" />
          <stop offset="100%" stopColor="#558B2F" />
        </linearGradient>
        <filter id="leaf-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#558B2F" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#leaf-shadow)">
        <path d="M24 42V24C24 14 32 6 42 6c0 12-8 20-18 20" fill="url(#leaf-grad)" />
        <path d="M24 24c-6 4-14 4-18 0 4-10 14-12 18-6" fill="url(#leaf-grad)" opacity="0.7"/>
        <path d="M24 42V24" stroke="#558B2F" strokeWidth="2" strokeLinecap="round"/>
        <path d="M24 28c4-2 8-4 12-10M24 32c-3-1-6-2-10-1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </g>
    </svg>
  )
}

// 3D Sparkle/Star Icon
export function SparkleIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="sparkle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA000" />
        </linearGradient>
        <filter id="sparkle-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#FFA000" floodOpacity="0.4"/>
        </filter>
      </defs>
      <g filter="url(#sparkle-shadow)">
        <path d="M24 4l3 12 12 3-12 3-3 12-3-12-12-3 12-3 3-12z" fill="url(#sparkle-grad)" />
        <path d="M10 10l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" fill="url(#sparkle-grad)" opacity="0.7"/>
        <path d="M38 32l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5 1.5-4z" fill="url(#sparkle-grad)" opacity="0.7"/>
      </g>
    </svg>
  )
}

// 3D Flower/Blossom Icon
export function FlowerIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="flower-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8BBD9" />
          <stop offset="100%" stopColor="#E91E63" />
        </linearGradient>
        <filter id="flower-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#E91E63" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#flower-shadow)">
        <ellipse cx="24" cy="12" rx="6" ry="10" fill="url(#flower-grad)" />
        <ellipse cx="24" cy="36" rx="6" ry="10" fill="url(#flower-grad)" />
        <ellipse cx="12" cy="24" rx="10" ry="6" fill="url(#flower-grad)" />
        <ellipse cx="36" cy="24" rx="10" ry="6" fill="url(#flower-grad)" />
        <circle cx="24" cy="24" r="6" fill="#FFE082" />
        <circle cx="24" cy="24" r="3" fill="#FFA000" />
      </g>
    </svg>
  )
}

// 3D Candle Icon
export function CandleIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="candle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8E1" />
          <stop offset="100%" stopColor="#FFCC80" />
        </linearGradient>
        <linearGradient id="flame-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FF6D00" />
          <stop offset="50%" stopColor="#FFAB00" />
          <stop offset="100%" stopColor="#FFD740" />
        </linearGradient>
        <filter id="candle-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#FFCC80" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#candle-shadow)">
        <rect x="18" y="20" width="12" height="24" rx="2" fill="url(#candle-grad)" />
        <path d="M24 20c-3-4-3-10 0-14 3 4 3 10 0 14z" fill="url(#flame-grad)" />
        <ellipse cx="24" cy="8" rx="2" ry="3" fill="#FFF59D" opacity="0.8"/>
        <rect x="20" y="22" width="2" height="20" fill="#fff" opacity="0.3"/>
      </g>
    </svg>
  )
}

// 3D Wave/Water Icon
export function WaveIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4FC3F7" />
          <stop offset="100%" stopColor="#0288D1" />
        </linearGradient>
        <filter id="wave-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#0288D1" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#wave-shadow)">
        <path d="M4 24c4-6 8-6 12 0s8 6 12 0 8-6 12 0" stroke="url(#wave-grad)" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M4 32c4-6 8-6 12 0s8 6 12 0 8-6 12 0" stroke="url(#wave-grad)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M4 40c4-6 8-6 12 0s8 6 12 0 8-6 12 0" stroke="url(#wave-grad)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4"/>
      </g>
    </svg>
  )
}

// 3D Retreat/Tent Icon
export function RetreatIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="retreat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A1887F" />
          <stop offset="100%" stopColor="#6D4C41" />
        </linearGradient>
        <linearGradient id="retreat-grass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
        <filter id="retreat-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#6D4C41" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#retreat-shadow)">
        <path d="M24 6L6 38h36L24 6z" fill="url(#retreat-grad)" />
        <path d="M24 6L14 38h20L24 6z" fill="#8D6E63" opacity="0.5"/>
        <path d="M20 38v-10h8v10" fill="#5D4037" />
        <ellipse cx="24" cy="40" rx="18" ry="4" fill="url(#retreat-grass)" opacity="0.8"/>
        <path d="M10 36c2-2 4-1 6 0s4 2 6 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      </g>
    </svg>
  )
}

// 3D Quote/Testimonial Icon
export function QuoteIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="quote-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#90CAF9" />
          <stop offset="100%" stopColor="#1976D2" />
        </linearGradient>
        <filter id="quote-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#1976D2" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#quote-shadow)">
        <path d="M18 14c-6 0-10 4-10 10v12h12V24H10c0-4 2-6 6-6l2-4z" fill="url(#quote-grad)" />
        <path d="M40 14c-6 0-10 4-10 10v12h12V24H32c0-4 2-6 6-6l2-4z" fill="url(#quote-grad)" />
        <path d="M12 28h4M34 28h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      </g>
    </svg>
  )
}

// 3D Link Icon
export function LinkIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="link-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7043" />
          <stop offset="100%" stopColor="#E64A19" />
        </linearGradient>
        <filter id="link-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#E64A19" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#link-shadow)">
        <path d="M20 28l-4 4a6 6 0 1 1-8-8l4-4" stroke="url(#link-grad)" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M28 20l4-4a6 6 0 1 1 8 8l-4 4" stroke="url(#link-grad)" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M18 30l12-12" stroke="url(#link-grad)" strokeWidth="4" strokeLinecap="round"/>
      </g>
    </svg>
  )
}

// 3D Phone/Call Icon
export function PhoneIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="phone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <filter id="phone-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#2E7D32" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#phone-shadow)">
        <path d="M14 6c-4 0-8 4-8 8 0 14 12 26 26 26 4 0 8-4 8-8l-6-6-4 4c-6-4-10-8-14-14l4-4-6-6z" fill="url(#phone-grad)" />
        <path d="M12 10l4 4-2 2c4 4 6 6 8 8l2-2 4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </g>
    </svg>
  )
}

// 3D Video Icon
export function VideoIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="video-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF5350" />
          <stop offset="100%" stopColor="#C62828" />
        </linearGradient>
        <filter id="video-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#C62828" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#video-shadow)">
        <rect x="4" y="12" width="28" height="24" rx="4" fill="url(#video-grad)" />
        <path d="M32 20l12-6v20l-12-6V20z" fill="url(#video-grad)" />
        <circle cx="18" cy="24" r="6" fill="#fff" opacity="0.3"/>
        <path d="M16 21l6 3-6 3V21z" fill="#fff" />
      </g>
    </svg>
  )
}

// 3D Star/Rating Icon
export function StarIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
        <filter id="star-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#FF8F00" floodOpacity="0.4"/>
        </filter>
      </defs>
      <g filter="url(#star-shadow)">
        <path d="M24 4l5.5 12.5L44 18l-11 9 3 14-12-7-12 7 3-14-11-9 14.5-1.5L24 4z" fill="url(#star-grad)" />
        <path d="M24 10l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1 3-7z" fill="#FFEB3B" opacity="0.5"/>
      </g>
    </svg>
  )
}

// 3D Heart Icon
export function HeartIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#C62828" />
        </linearGradient>
        <filter id="heart-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#C62828" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#heart-shadow)">
        <path d="M24 42s-16-10-16-22c0-6 4-10 10-10 4 0 6 2 6 2s2-2 6-2c6 0 10 4 10 10 0 12-16 22-16 22z" fill="url(#heart-grad)" />
        <ellipse cx="16" cy="18" rx="4" ry="3" fill="#fff" opacity="0.3"/>
      </g>
    </svg>
  )
}

// 3D Lotus Icon
export function LotusIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="lotus-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CE93D8" />
          <stop offset="100%" stopColor="#7B1FA2" />
        </linearGradient>
        <filter id="lotus-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#7B1FA2" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#lotus-shadow)">
        <ellipse cx="24" cy="32" rx="16" ry="8" fill="url(#lotus-grad)" opacity="0.4"/>
        <path d="M24 36c-4-8-12-16-12-24 8 4 12 12 12 24z" fill="url(#lotus-grad)" />
        <path d="M24 36c4-8 12-16 12-24-8 4-12 12-12 24z" fill="url(#lotus-grad)" />
        <path d="M24 36c-2-10-6-18-6-26 4 4 6 14 6 26z" fill="url(#lotus-grad)" opacity="0.8"/>
        <path d="M24 36c2-10 6-18 6-26-4 4-6 14-6 26z" fill="url(#lotus-grad)" opacity="0.8"/>
        <path d="M24 36V20" stroke="#fff" strokeWidth="1" opacity="0.3"/>
      </g>
    </svg>
  )
}

// 3D Seedling Icon
export function SeedlingIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="seedling-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AED581" />
          <stop offset="100%" stopColor="#689F38" />
        </linearGradient>
        <filter id="seedling-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#689F38" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#seedling-shadow)">
        <path d="M24 44V28" stroke="url(#seedling-grad)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M24 28c-6-4-14-4-18 0 2-10 10-14 18-8" fill="url(#seedling-grad)" />
        <path d="M24 20c6-6 16-6 18 2-4-2-10-2-18 6" fill="url(#seedling-grad)" />
        <ellipse cx="24" cy="44" rx="8" ry="3" fill="#8D6E63" opacity="0.5"/>
      </g>
    </svg>
  )
}

// 3D Brain/Mind Icon
export function BrainIcon3D({ size = 24, className = '', style }: Icon3DProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="brain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F48FB1" />
          <stop offset="100%" stopColor="#AD1457" />
        </linearGradient>
        <filter id="brain-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#AD1457" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#brain-shadow)">
        <path d="M14 24c-4 0-8-4-8-8s4-8 8-8c2 0 4 1 5 2 1-4 5-6 9-6s8 3 9 7c4 1 7 5 7 9s-3 8-7 8" fill="url(#brain-grad)" />
        <path d="M14 24c-4 0-8 4-8 8s4 8 8 8c2 0 4-1 5-2 1 4 5 6 9 6s8-3 9-7c4-1 7-5 7-9" fill="url(#brain-grad)" />
        <path d="M24 8v32M16 16c4 4 8 4 12 0M16 32c4-4 8-4 12 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </g>
    </svg>
  )
}

// Export a map for easy lookup
export const Icons3DMap: Record<string, React.FC<Icon3DProps>> = {
  yoga: YogaIcon3D,
  leaf: LeafIcon3D,
  sparkle: SparkleIcon3D,
  flower: FlowerIcon3D,
  candle: CandleIcon3D,
  wave: WaveIcon3D,
  retreat: RetreatIcon3D,
  quote: QuoteIcon3D,
  link: LinkIcon3D,
  phone: PhoneIcon3D,
  video: VideoIcon3D,
  star: StarIcon3D,
  heart: HeartIcon3D,
  lotus: LotusIcon3D,
  seedling: SeedlingIcon3D,
  brain: BrainIcon3D,
}

export default Icons3DMap
