'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'

// ============================================
// 3D TILT HOOK
// ============================================

interface TiltConfig {
  maxTilt?: number
  perspective?: number
  scale?: number
  speed?: number
  glare?: boolean
  glareMaxOpacity?: number
}

interface TiltValues {
  tiltX: number
  tiltY: number
  percentX: number
  percentY: number
}

export function useTilt3D(config: TiltConfig = {}) {
  const {
    maxTilt = 10,
    perspective = 1000,
    scale = 1.02,
    speed = 400,
  } = config

  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState<TiltValues>({ tiltX: 0, tiltY: 0, percentX: 50, percentY: 50 })
  const [isHovering, setIsHovering] = useState(false)

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || prefersReducedMotion) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100

    const tiltX = ((y - centerY) / centerY) * -maxTilt
    const tiltY = ((x - centerX) / centerX) * maxTilt

    setTilt({ tiltX, tiltY, percentX, percentY })
  }, [maxTilt, prefersReducedMotion])

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setTilt({ tiltX: 0, tiltY: 0, percentX: 50, percentY: 50 })
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave])

  const style: React.CSSProperties = {
    transform: `perspective(${perspective}px) rotateX(${tilt.tiltX}deg) rotateY(${tilt.tiltY}deg) scale(${isHovering ? scale : 1})`,
    transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
    transformStyle: 'preserve-3d',
  }

  const glareStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    background: `radial-gradient(circle at ${tilt.percentX}% ${tilt.percentY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
    opacity: isHovering ? 1 : 0,
    transition: `opacity ${speed}ms ease`,
    borderRadius: 'inherit',
  }

  return { ref, style, glareStyle, tilt, isHovering }
}

// ============================================
// 3D TILT CARD COMPONENT
// ============================================

interface Tilt3DCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  maxTilt?: number
  perspective?: number
  scale?: number
  glare?: boolean
}

export function Tilt3DCard({ 
  children, 
  className = '', 
  style = {},
  maxTilt = 8,
  perspective = 1000,
  scale = 1.02,
  glare = true,
}: Tilt3DCardProps) {
  const { ref, style: tiltStyle, glareStyle } = useTilt3D({ maxTilt, perspective, scale })

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ ...style, ...tiltStyle }}
    >
      {children}
      {glare && <div style={glareStyle} aria-hidden="true" />}
    </div>
  )
}

// ============================================
// PARALLAX CONTAINER
// ============================================

interface ParallaxLayerProps {
  children: React.ReactNode
  depth?: number // 0 = no movement, 1 = full movement
  className?: string
  style?: React.CSSProperties
}

export function useParallax() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return { scrollY, mousePos }
}

export function ParallaxLayer({ children, depth = 0.5, className = '', style = {} }: ParallaxLayerProps) {
  const { scrollY, mousePos } = useParallax()
  
  const translateY = scrollY * depth * 0.3
  const translateX = mousePos.x * depth * 20
  const mouseY = mousePos.y * depth * 20

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `translate3d(${translateX}px, ${translateY + mouseY}px, 0)`,
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}

// ============================================
// FLOATING 3D SHAPES
// ============================================

interface FloatingShapeProps {
  color: string
  size: number
  blur?: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  depth?: number
  delay?: number
}

export function FloatingShape({ 
  color, 
  size, 
  blur = 60,
  top,
  left,
  right,
  bottom,
  depth = 0.5,
  delay = 0,
}: FloatingShapeProps) {
  const { mousePos } = useParallax()
  
  const translateX = mousePos.x * depth * 30
  const translateY = mousePos.y * depth * 30

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: `blur(${blur}px)`,
        opacity: 0.6,
        transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
        transition: 'transform 0.3s ease-out',
        animation: `float3D ${8 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    />
  )
}

// ============================================
// 3D HERO CARD
// ============================================

interface Hero3DCardProps {
  children: React.ReactNode
  className?: string
}

export function Hero3DCard({ children, className = '' }: Hero3DCardProps) {
  const { ref, style, tilt, isHovering } = useTilt3D({ 
    maxTilt: 5, 
    perspective: 1200,
    scale: 1.01,
    speed: 600,
  })

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Background depth layer */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          transform: 'translateZ(-20px)',
          background: 'rgba(0,0,0,0.05)',
          filter: 'blur(20px)',
        }}
        aria-hidden="true"
      />
      
      {/* Main content */}
      <div style={{ transform: 'translateZ(0)' }}>
        {children}
      </div>

      {/* Glare effect */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
        style={{
          background: `radial-gradient(
            ellipse at ${tilt.percentX}% ${tilt.percentY}%,
            rgba(255,255,255,0.15) 0%,
            transparent 50%
          )`,
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// ============================================
// DEPTH GLOW (for profile images)
// ============================================

interface DepthGlowProps {
  color: string
  size: number
  children: React.ReactNode
  className?: string
}

export function DepthGlow({ color, size, children, className = '' }: DepthGlowProps) {
  const { mousePos } = useParallax()
  
  const offsetX = mousePos.x * 10
  const offsetY = mousePos.y * 10

  return (
    <div className={`relative ${className}`} style={{ perspective: '800px' }}>
      {/* Depth glow layer */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: size * 1.5,
          height: size * 1.5,
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translate3d(${offsetX}px, ${offsetY}px, -30px)`,
          background: `radial-gradient(circle, ${color}40 0%, transparent 60%)`,
          filter: 'blur(30px)',
          transition: 'transform 0.2s ease-out',
        }}
        aria-hidden="true"
      />
      
      {/* Secondary glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: size * 1.3,
          height: size * 1.3,
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translate3d(${offsetX * 0.5}px, ${offsetY * 0.5}px, -15px)`,
          background: `radial-gradient(circle, ${color}25 0%, transparent 50%)`,
          filter: 'blur(20px)',
          animation: 'pulse3D 4s ease-in-out infinite',
          transition: 'transform 0.2s ease-out',
        }}
        aria-hidden="true"
      />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

// ============================================
// CSS KEYFRAMES (add to globals.css)
// ============================================

export const css3DKeyframes = `
@keyframes float3D {
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  25% {
    transform: translate3d(10px, -15px, 20px) rotate(2deg);
  }
  50% {
    transform: translate3d(-5px, 10px, -10px) rotate(-1deg);
  }
  75% {
    transform: translate3d(-15px, -5px, 15px) rotate(1deg);
  }
}

@keyframes pulse3D {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes depthFloat {
  0%, 100% {
    transform: translateZ(0) translateY(0);
  }
  50% {
    transform: translateZ(20px) translateY(-10px);
  }
}
`

export default {
  useTilt3D,
  useParallax,
  Tilt3DCard,
  ParallaxLayer,
  FloatingShape,
  Hero3DCard,
  DepthGlow,
}
