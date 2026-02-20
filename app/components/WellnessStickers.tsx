'use client'

import React from 'react'

interface StickerProps {
  size?: number
  className?: string
  style?: React.CSSProperties
}

// 3D Lotus Sticker
export const LotusSticker = ({ size = 80, className = '', style }: StickerProps) => (
  <div 
    className={`floating-sticker ${className}`}
    style={{
      width: size,
      height: size,
      filter: 'drop-shadow(0 8px 16px rgba(255, 112, 67, 0.25))',
      ...style,
    }}
  >
    <svg viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="lotus-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB4A2" />
          <stop offset="100%" stopColor="#FF7043" />
        </linearGradient>
        <linearGradient id="lotus-center" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFCC80" />
          <stop offset="100%" stopColor="#FFB74D" />
        </linearGradient>
        <filter id="lotus-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#lotus-glow)">
        {/* Outer petals */}
        <ellipse cx="50" cy="45" rx="12" ry="30" fill="url(#lotus-pink)" transform="rotate(-30 50 50)" opacity="0.8"/>
        <ellipse cx="50" cy="45" rx="12" ry="30" fill="url(#lotus-pink)" transform="rotate(30 50 50)" opacity="0.8"/>
        <ellipse cx="50" cy="45" rx="12" ry="30" fill="url(#lotus-pink)" transform="rotate(-60 50 50)" opacity="0.6"/>
        <ellipse cx="50" cy="45" rx="12" ry="30" fill="url(#lotus-pink)" transform="rotate(60 50 50)" opacity="0.6"/>
        {/* Inner petals */}
        <ellipse cx="50" cy="48" rx="8" ry="22" fill="url(#lotus-pink)" transform="rotate(-15 50 50)"/>
        <ellipse cx="50" cy="48" rx="8" ry="22" fill="url(#lotus-pink)" transform="rotate(15 50 50)"/>
        <ellipse cx="50" cy="50" rx="6" ry="18" fill="url(#lotus-pink)"/>
        {/* Center */}
        <circle cx="50" cy="55" r="10" fill="url(#lotus-center)"/>
        <circle cx="48" cy="53" r="3" fill="white" opacity="0.6"/>
        {/* Base */}
        <ellipse cx="50" cy="80" rx="25" ry="8" fill="url(#lotus-pink)" opacity="0.3"/>
      </g>
    </svg>
  </div>
)

// 3D Meditation Person Sticker
export const MeditationSticker = ({ size = 80, className = '', style }: StickerProps) => (
  <div 
    className={`floating-sticker ${className}`}
    style={{
      width: size,
      height: size,
      filter: 'drop-shadow(0 8px 16px rgba(255, 138, 101, 0.3))',
      ...style,
    }}
  >
    <svg viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="skin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFCC80" />
          <stop offset="100%" stopColor="#FFB74D" />
        </linearGradient>
        <linearGradient id="clothes-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8A65" />
          <stop offset="100%" stopColor="#FF7043" />
        </linearGradient>
        <linearGradient id="aura-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE0B2" />
          <stop offset="100%" stopColor="#FFCC80" />
        </linearGradient>
      </defs>
      {/* Aura circles */}
      <circle cx="50" cy="50" r="45" fill="url(#aura-grad)" opacity="0.2"/>
      <circle cx="50" cy="50" r="35" fill="url(#aura-grad)" opacity="0.3"/>
      {/* Body */}
      <ellipse cx="50" cy="70" rx="20" ry="15" fill="url(#clothes-grad)"/>
      {/* Arms */}
      <ellipse cx="30" cy="60" rx="8" ry="5" fill="url(#skin-grad)" transform="rotate(-20 30 60)"/>
      <ellipse cx="70" cy="60" rx="8" ry="5" fill="url(#skin-grad)" transform="rotate(20 70 60)"/>
      {/* Hands on knees */}
      <circle cx="32" cy="72" r="5" fill="url(#skin-grad)"/>
      <circle cx="68" cy="72" r="5" fill="url(#skin-grad)"/>
      {/* Head */}
      <circle cx="50" cy="35" r="14" fill="url(#skin-grad)"/>
      {/* Hair */}
      <ellipse cx="50" cy="28" rx="12" ry="8" fill="#5D4037"/>
      {/* Eyes closed */}
      <path d="M44 35 Q46 33 48 35" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
      <path d="M52 35 Q54 33 56 35" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
      {/* Peaceful smile */}
      <path d="M46 40 Q50 43 54 40" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
      {/* Sparkles */}
      <circle cx="25" cy="30" r="2" fill="#FFD54F"/>
      <circle cx="75" cy="35" r="2" fill="#FFD54F"/>
      <circle cx="80" cy="55" r="1.5" fill="#FFD54F"/>
    </svg>
  </div>
)

// 3D Heart Sticker
export const HeartSticker = ({ size = 60, className = '', style }: StickerProps) => (
  <div 
    className={`floating-sticker ${className}`}
    style={{
      width: size,
      height: size,
      filter: 'drop-shadow(0 6px 12px rgba(255, 112, 67, 0.3))',
      ...style,
    }}
  >
    <svg viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8A80" />
          <stop offset="100%" stopColor="#FF5252" />
        </linearGradient>
      </defs>
      <path 
        d="M50 85 C20 60 10 40 25 25 C35 15 50 20 50 35 C50 20 65 15 75 25 C90 40 80 60 50 85Z" 
        fill="url(#heart-grad)"
      />
      <ellipse cx="35" cy="35" rx="8" ry="6" fill="white" opacity="0.4"/>
    </svg>
  </div>
)

// 3D Sparkle Sticker
export const SparkleSticker = ({ size = 50, className = '', style }: StickerProps) => (
  <div 
    className={`floating-sticker ${className}`}
    style={{
      width: size,
      height: size,
      filter: 'drop-shadow(0 4px 8px rgba(255, 193, 7, 0.4))',
      ...style,
    }}
  >
    <svg viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="sparkle-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>
      </defs>
      <path d="M50 5 L55 40 L90 50 L55 60 L50 95 L45 60 L10 50 L45 40 Z" fill="url(#sparkle-gold)"/>
      <path d="M50 20 L52 45 L75 50 L52 55 L50 80 L48 55 L25 50 L48 45 Z" fill="#FFF59D" opacity="0.6"/>
    </svg>
  </div>
)

// 3D Leaf Sticker  
export const LeafSticker = ({ size = 60, className = '', style }: StickerProps) => (
  <div 
    className={`floating-sticker ${className}`}
    style={{
      width: size,
      height: size,
      filter: 'drop-shadow(0 6px 12px rgba(129, 199, 132, 0.3))',
      ...style,
    }}
  >
    <svg viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="leaf-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A5D6A7" />
          <stop offset="100%" stopColor="#66BB6A" />
        </linearGradient>
      </defs>
      <path d="M50 90 Q50 50 20 20 Q50 30 80 20 Q50 50 50 90 Z" fill="url(#leaf-green)"/>
      <path d="M50 85 L50 35" stroke="#43A047" strokeWidth="2"/>
      <path d="M50 50 Q40 45 35 35" stroke="#43A047" strokeWidth="1.5" fill="none"/>
      <path d="M50 60 Q60 55 65 45" stroke="#43A047" strokeWidth="1.5" fill="none"/>
    </svg>
  </div>
)

// 3D Sun Sticker
export const SunSticker = ({ size = 70, className = '', style }: StickerProps) => (
  <div 
    className={`floating-sticker ${className}`}
    style={{
      width: size,
      height: size,
      filter: 'drop-shadow(0 6px 12px rgba(255, 183, 77, 0.4))',
      ...style,
    }}
  >
    <svg viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="sun-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FFB74D" />
        </linearGradient>
        <linearGradient id="sun-ray" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFCC80" />
          <stop offset="100%" stopColor="#FFA726" />
        </linearGradient>
      </defs>
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <rect 
          key={i}
          x="48" y="5" width="4" height="15" rx="2"
          fill="url(#sun-ray)"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {/* Sun face */}
      <circle cx="50" cy="50" r="25" fill="url(#sun-grad)"/>
      {/* Eyes */}
      <circle cx="42" cy="47" r="3" fill="#FF8F00"/>
      <circle cx="58" cy="47" r="3" fill="#FF8F00"/>
      {/* Smile */}
      <path d="M40 55 Q50 65 60 55" stroke="#FF8F00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <circle cx="35" cy="52" r="4" fill="#FFCC80" opacity="0.6"/>
      <circle cx="65" cy="52" r="4" fill="#FFCC80" opacity="0.6"/>
    </svg>
  </div>
)

// 3D Crystal Sticker
export const CrystalSticker = ({ size = 60, className = '', style }: StickerProps) => (
  <div 
    className={`floating-sticker ${className}`}
    style={{
      width: size,
      height: size,
      filter: 'drop-shadow(0 6px 12px rgba(206, 147, 216, 0.4))',
      ...style,
    }}
  >
    <svg viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="crystal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E1BEE7" />
          <stop offset="50%" stopColor="#CE93D8" />
          <stop offset="100%" stopColor="#AB47BC" />
        </linearGradient>
      </defs>
      <polygon points="50,10 70,35 65,85 35,85 30,35" fill="url(#crystal-grad)"/>
      <polygon points="50,10 30,35 35,85 50,75" fill="#E1BEE7" opacity="0.5"/>
      <polygon points="50,10 50,30 40,35" fill="white" opacity="0.4"/>
      <line x1="50" y1="30" x2="50" y2="70" stroke="white" strokeWidth="1" opacity="0.3"/>
    </svg>
  </div>
)

// 3D Moon Sticker
export const MoonSticker = ({ size = 60, className = '', style }: StickerProps) => (
  <div 
    className={`floating-sticker ${className}`}
    style={{
      width: size,
      height: size,
      filter: 'drop-shadow(0 6px 12px rgba(255, 224, 178, 0.4))',
      ...style,
    }}
  >
    <svg viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8E1" />
          <stop offset="100%" stopColor="#FFE082" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="35" fill="url(#moon-grad)"/>
      <circle cx="65" cy="50" r="28" fill="#FFFAF0"/>
      {/* Craters */}
      <circle cx="40" cy="40" r="5" fill="#FFE0B2" opacity="0.5"/>
      <circle cx="35" cy="55" r="4" fill="#FFE0B2" opacity="0.5"/>
      <circle cx="45" cy="65" r="3" fill="#FFE0B2" opacity="0.5"/>
      {/* Sleepy face */}
      <path d="M30 45 Q33 43 36 45" stroke="#FFB74D" strokeWidth="1.5" fill="none"/>
      <path d="M42 48 Q45 46 48 48" stroke="#FFB74D" strokeWidth="1.5" fill="none"/>
      <path d="M32 55 Q38 58 44 55" stroke="#FFB74D" strokeWidth="1.5" fill="none"/>
    </svg>
  </div>
)

// 3D Wellness Badge Sticker
export const WellnessBadge = ({ size = 90, className = '', style }: StickerProps) => (
  <div 
    className={`floating-sticker ${className}`}
    style={{
      width: size,
      height: size,
      filter: 'drop-shadow(0 8px 16px rgba(255, 112, 67, 0.3))',
      ...style,
    }}
  >
    <svg viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="badge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFCCBC" />
          <stop offset="100%" stopColor="#FF8A65" />
        </linearGradient>
        <linearGradient id="badge-inner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3E0" />
          <stop offset="100%" stopColor="#FFE0B2" />
        </linearGradient>
      </defs>
      {/* Ribbon effect */}
      <path d="M20 80 L30 95 L30 75 Z" fill="#FF7043"/>
      <path d="M80 80 L70 95 L70 75 Z" fill="#FF7043"/>
      {/* Badge circle */}
      <circle cx="50" cy="50" r="38" fill="url(#badge-grad)"/>
      <circle cx="50" cy="50" r="32" fill="url(#badge-inner)"/>
      {/* Inner lotus */}
      <ellipse cx="50" cy="48" rx="6" ry="15" fill="#FF8A65" opacity="0.7"/>
      <ellipse cx="50" cy="48" rx="6" ry="15" fill="#FF8A65" opacity="0.7" transform="rotate(60 50 50)"/>
      <ellipse cx="50" cy="48" rx="6" ry="15" fill="#FF8A65" opacity="0.7" transform="rotate(-60 50 50)"/>
      <circle cx="50" cy="55" r="6" fill="#FFCC80"/>
      {/* Stars */}
      <circle cx="30" cy="35" r="2" fill="#FFD54F"/>
      <circle cx="70" cy="35" r="2" fill="#FFD54F"/>
      <circle cx="50" cy="25" r="2" fill="#FFD54F"/>
    </svg>
  </div>
)

// Floating animation styles
export const StickerStyles = () => (
  <style jsx global>{`
    @keyframes floatSticker {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      25% {
        transform: translateY(-8px) rotate(2deg);
      }
      50% {
        transform: translateY(-15px) rotate(0deg);
      }
      75% {
        transform: translateY(-8px) rotate(-2deg);
      }
    }
    
    @keyframes pulseGlow {
      0%, 100% {
        filter: drop-shadow(0 8px 16px rgba(255, 112, 67, 0.25));
      }
      50% {
        filter: drop-shadow(0 12px 24px rgba(255, 112, 67, 0.4));
      }
    }
    
    .floating-sticker {
      animation: floatSticker 6s ease-in-out infinite;
    }
    
    .floating-sticker:nth-child(2n) {
      animation-delay: -2s;
    }
    
    .floating-sticker:nth-child(3n) {
      animation-delay: -4s;
      animation-duration: 7s;
    }
    
    .sticker-glow {
      animation: pulseGlow 3s ease-in-out infinite;
    }
  `}</style>
)

export default {
  LotusSticker,
  MeditationSticker,
  HeartSticker,
  SparkleSticker,
  LeafSticker,
  SunSticker,
  CrystalSticker,
  MoonSticker,
  WellnessBadge,
  StickerStyles,
}
