'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react'
import { ThemeConfig, BackgroundAnimationType } from '../../lib/themes'

// ============================================
// FLOATING PARTICLES
// ============================================

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

function FloatingParticles({ 
  color = 'rgba(0,0,0,0.1)', 
  count = 20,
  speed = 'slow'
}: { 
  color?: string
  count?: number
  speed?: 'slow' | 'medium' | 'fast'
}) {
  const [particles, setParticles] = useState<Particle[]>([])
  const speedMultiplier = speed === 'slow' ? 0.3 : speed === 'medium' ? 0.6 : 1
  
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 4,
      speedX: (Math.random() - 0.5) * speedMultiplier,
      speedY: (Math.random() - 0.5) * speedMultiplier,
      opacity: Math.random() * 0.5 + 0.3,
    }))
    setParticles(initialParticles)
  }, [count, speedMultiplier])

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            opacity: particle.opacity,
            '--float-x': `${particle.speedX * 100}px`,
            '--float-y': `${particle.speedY * 100}px`,
            '--duration': `${20 + Math.random() * 15}s`,
          } as React.CSSProperties}
        />
      ))}
      <style jsx>{`
        .particles-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          animation: floatParticle var(--duration) ease-in-out infinite;
        }
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(var(--float-x), var(--float-y));
          }
          50% {
            transform: translate(calc(var(--float-x) * -0.5), calc(var(--float-y) * 1.5));
          }
          75% {
            transform: translate(calc(var(--float-x) * -1), calc(var(--float-y) * -0.5));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .particle {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================
// GRADIENT SHIFT BACKGROUND
// ============================================

function GradientShift({ 
  colors = ['#F5E6D3', '#E8D5C4', '#F5E6D3'],
  speed = 'slow'
}: {
  colors?: string[]
  speed?: 'slow' | 'medium' | 'fast'
}) {
  const duration = speed === 'slow' ? '20s' : speed === 'medium' ? '12s' : '8s'
  
  return (
    <div className="gradient-shift-bg" aria-hidden="true">
      <style jsx>{`
        .gradient-shift-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            ${colors[0]} 0%,
            ${colors[1] || colors[0]} 50%,
            ${colors[2] || colors[0]} 100%
          );
          background-size: 400% 400%;
          animation: gradientShift ${duration} ease infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gradient-shift-bg {
            animation: none;
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================
// SOFT WAVES BACKGROUND
// ============================================

function SoftWaves({
  colors = ['#E8F4F8', '#D1E9F0', '#BAE6FD'],
  speed = 'slow'
}: {
  colors?: string[]
  speed?: 'slow' | 'medium' | 'fast'
}) {
  const duration = speed === 'slow' ? '25s' : speed === 'medium' ? '15s' : '10s'
  
  return (
    <div className="soft-waves-bg" aria-hidden="true">
      <div className="wave wave-1" />
      <div className="wave wave-2" />
      <div className="wave wave-3" />
      <style jsx>{`
        .soft-waves-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: ${colors[0]};
        }
        .wave {
          position: absolute;
          width: 200%;
          height: 200%;
          left: -50%;
          border-radius: 45%;
          animation: wave ${duration} linear infinite;
        }
        .wave-1 {
          background: ${colors[1] || colors[0]}20;
          top: 60%;
        }
        .wave-2 {
          background: ${colors[2] || colors[1] || colors[0]}15;
          top: 70%;
          animation-duration: calc(${duration} * 1.2);
          animation-delay: -5s;
        }
        .wave-3 {
          background: ${colors[1] || colors[0]}10;
          top: 75%;
          animation-duration: calc(${duration} * 0.8);
          animation-delay: -10s;
        }
        @keyframes wave {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wave {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================
// AURORA BACKGROUND
// ============================================

function AuroraBackground({
  colors = ['#FAF5FF', '#F3E8FF', '#E9D5FF'],
  speed = 'slow'
}: {
  colors?: string[]
  speed?: 'slow' | 'medium' | 'fast'
}) {
  const duration = speed === 'slow' ? '30s' : speed === 'medium' ? '20s' : '12s'
  
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="aurora-layer aurora-1" />
      <div className="aurora-layer aurora-2" />
      <style jsx>{`
        .aurora-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: ${colors[0]};
        }
        .aurora-layer {
          position: absolute;
          width: 150%;
          height: 150%;
          filter: blur(80px);
          opacity: 0.5;
        }
        .aurora-1 {
          background: radial-gradient(ellipse at center, ${colors[1]}80 0%, transparent 70%);
          top: -25%;
          left: -25%;
          animation: aurora1 ${duration} ease-in-out infinite;
        }
        .aurora-2 {
          background: radial-gradient(ellipse at center, ${colors[2] || colors[1]}60 0%, transparent 70%);
          bottom: -25%;
          right: -25%;
          animation: aurora2 ${duration} ease-in-out infinite;
          animation-delay: calc(${duration} / -2);
        }
        @keyframes aurora1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 10%) scale(1.1); }
          66% { transform: translate(-5%, 5%) scale(0.95); }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-8%, -5%) scale(1.05); }
          66% { transform: translate(5%, -10%) scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-layer {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================
// MAIN ANIMATED BACKGROUND COMPONENT
// ============================================

interface AnimatedBackgroundProps {
  theme: ThemeConfig
  children?: React.ReactNode
}

export function AnimatedBackground({ theme, children }: AnimatedBackgroundProps) {
  const config = theme.backgroundAnimationConfig
  
  const renderAnimation = () => {
    switch (theme.backgroundAnimationType) {
      case 'floating-particles':
        return (
          <FloatingParticles
            color={config?.particleColor}
            count={config?.particleCount}
            speed={config?.speed}
          />
        )
      case 'gradient-shift':
        return (
          <GradientShift
            colors={config?.gradientColors}
            speed={config?.speed}
          />
        )
      case 'soft-waves':
        return (
          <SoftWaves
            colors={config?.gradientColors}
            speed={config?.speed}
          />
        )
      case 'aurora':
        return (
          <AuroraBackground
            colors={config?.gradientColors}
            speed={config?.speed}
          />
        )
      default:
        return null
    }
  }

  return (
    <div 
      className="animated-bg-wrapper"
      style={{
        background: theme.backgroundGradient || theme.background,
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {renderAnimation()}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

// ============================================
// GLOW AURA COMPONENT
// ============================================

interface GlowAuraProps {
  config: ThemeConfig['glowAura']
  size?: number
}

export function GlowAura({ config, size = 112 }: GlowAuraProps) {
  if (!config.enabled) return null
  
  const auraSize = size + (config.blur * 2)
  
  return (
    <div 
      className="glow-aura"
      style={{
        position: 'absolute',
        width: `${auraSize}px`,
        height: `${auraSize}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${config.color}${Math.round(config.opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        filter: `blur(${config.blur}px)`,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <style jsx>{`
        .glow-aura {
          ${config.animation === 'pulse' ? `
            animation: glowPulse 3s ease-in-out infinite;
          ` : config.animation === 'breathe' ? `
            animation: glowBreathe 4s ease-in-out infinite;
          ` : ''}
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes glowBreathe {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .glow-aura {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================
// ANIMATED BLOCK WRAPPER
// ============================================

interface AnimatedBlockProps {
  children: React.ReactNode
  animation: ThemeConfig['blockAnimation']
  index: number
  hoverEffect: ThemeConfig['blockHoverEffect']
  style?: React.CSSProperties
  className?: string
}

export function AnimatedBlock({ 
  children, 
  animation, 
  index, 
  hoverEffect,
  style,
  className 
}: AnimatedBlockProps) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Only animate once on first load
    const timer = setTimeout(() => setHasAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const getInitialStyle = (): React.CSSProperties => {
    if (hasAnimated) return {}
    
    switch (animation) {
      case 'fadeUp':
        return { opacity: 0, transform: 'translateY(20px)' }
      case 'slideIn':
        return { opacity: 0, transform: 'translateX(-20px)' }
      case 'staggeredAppear':
        return { opacity: 0, transform: 'translateY(15px) scale(0.98)' }
      case 'softScale':
        return { opacity: 0, transform: 'scale(0.95)' }
      case 'floatOnHover':
        return { opacity: 0 }
      default:
        return {}
    }
  }

  const getAnimatedStyle = (): React.CSSProperties => {
    const delay = index * 0.08
    return {
      opacity: 1,
      transform: 'translateY(0) translateX(0) scale(1)',
      transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    }
  }

  return (
    <div
      ref={ref}
      className={`animated-block ${className || ''}`}
      style={{
        ...style,
        ...getInitialStyle(),
        ...(hasAnimated ? getAnimatedStyle() : {}),
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.transform = `translateY(${hoverEffect.translateY}px) scale(${hoverEffect.scale})`
        el.style.boxShadow = hoverEffect.shadowIncrease
        if (hoverEffect.glowColor) {
          el.style.boxShadow = `${hoverEffect.shadowIncrease}, 0 0 30px ${hoverEffect.glowColor}`
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.transform = 'translateY(0) scale(1)'
        el.style.boxShadow = style?.boxShadow?.toString() || ''
      }}
    >
      {children}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .animated-block {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default AnimatedBackground
