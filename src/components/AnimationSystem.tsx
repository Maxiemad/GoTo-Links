import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../styles/theme'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  type: 'circle' | 'triangle' | 'hexagon' | 'lotus'
  rotation: number
  rotationSpeed: number
}

interface FloatingParticlesProps {
  count?: number
  intensity?: 'low' | 'medium' | 'high'
  sacredGeometry?: boolean
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 30,
  intensity = 'medium',
  sacredGeometry = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const particleCount = intensity === 'low' ? count * 0.5 : intensity === 'high' ? count * 1.5 : count
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      type: sacredGeometry
        ? (['circle', 'triangle', 'hexagon', 'lotus'][Math.floor(Math.random() * 4)] as Particle['type'])
        : 'circle',
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }))

    const drawParticle = (particle: Particle) => {
      ctx.save()
      ctx.globalAlpha = particle.opacity
      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.rotation)

      switch (particle.type) {
        case 'circle':
          ctx.beginPath()
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = colors.primary[300]
          ctx.fill()
          break

        case 'triangle':
          ctx.beginPath()
          ctx.moveTo(0, -particle.size)
          ctx.lineTo(-particle.size * 0.866, particle.size * 0.5)
          ctx.lineTo(particle.size * 0.866, particle.size * 0.5)
          ctx.closePath()
          ctx.fillStyle = colors.secondary[300]
          ctx.fill()
          break

        case 'hexagon':
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i
            const x = Math.cos(angle) * particle.size
            const y = Math.sin(angle) * particle.size
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.strokeStyle = colors.accent[300]
          ctx.lineWidth = 1
          ctx.stroke()
          break

        case 'lotus':
          // Draw lotus petal shape
          ctx.beginPath()
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 4) * i
            const radius = particle.size * (1 + Math.sin(angle * 2) * 0.3)
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.fillStyle = colors.secondary[200]
          ctx.fill()
          break
      }

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.rotation += particle.rotationSpeed

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        drawParticle(particle)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [count, intensity, sacredGeometry, prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.4,
      }}
    />
  )
}

interface BreathingCircleProps {
  size?: number
  color?: string
  duration?: number
  delay?: number
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  size = 100,
  color = colors.primary[200],
  duration = 4,
  delay = 0,
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `2px solid ${color}`,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />
    )
  }

  return (
    <div
      className="breathing-circle"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        opacity: 0.3,
        animation: `breathe ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: 'none',
      }}
    />
  )
}

interface LotusElementProps {
  size?: number
  petals?: number
  color?: string
}

export const LotusElement: React.FC<LotusElementProps> = ({
  size = 60,
  petals = 8,
  color = colors.secondary[300],
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (prefersReducedMotion || !svgRef.current) return

    const svg = svgRef.current
    const petals = svg.querySelectorAll('.lotus-petal')
    
    petals.forEach((petal, index) => {
      const element = petal as SVGPathElement
      const delay = index * 0.1
      element.style.animation = `lotusBreathe 3s ease-in-out infinite`
      element.style.animationDelay = `${delay}s`
    })
  }, [prefersReducedMotion])

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        opacity: 0.4,
        filter: 'blur(0.5px)',
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / petals
        const startAngle = angle - Math.PI / petals
        const endAngle = angle + Math.PI / petals
        const innerRadius = 20
        const outerRadius = 40

        const x1 = 50 + Math.cos(startAngle) * innerRadius
        const y1 = 50 + Math.sin(startAngle) * innerRadius
        const x2 = 50 + Math.cos(startAngle) * outerRadius
        const y2 = 50 + Math.sin(startAngle) * outerRadius
        const x3 = 50 + Math.cos(endAngle) * outerRadius
        const y3 = 50 + Math.sin(endAngle) * outerRadius
        const x4 = 50 + Math.cos(endAngle) * innerRadius
        const y4 = 50 + Math.sin(endAngle) * innerRadius

        return (
          <path
            key={i}
            className="lotus-petal"
            d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} Z`}
            fill={color}
            opacity={0.6}
          />
        )
      })}
    </svg>
  )
}

/* Aurora-style soft gradient blobs */
interface AuroraGlowProps {
  size?: number
  color?: string
  duration?: number
  delay?: number
  style?: React.CSSProperties
}

export const AuroraGlow: React.FC<AuroraGlowProps> = ({
  size = 300,
  color = colors.primary[200],
  duration = 18,
  delay = 0,
  style = {},
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return null
  return (
    <div
      className="aurora-glow"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}40 0%, ${color}15 40%, transparent 70%)`,
        filter: 'blur(50px)',
        pointerEvents: 'none',
        animation: `auroraFloat ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.7,
        ...style,
      }}
    />
  )
}

/* Soft animated wave lines */
interface SoftWavesProps {
  color?: string
  opacity?: number
  style?: React.CSSProperties
}

export const SoftWaves: React.FC<SoftWavesProps> = ({
  color = colors.primary[200],
  opacity = 0.15,
  style = {},
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return null
  return (
    <div
      className="soft-waves"
      style={{
        position: 'absolute',
        inset: 0,
        background: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 80px,
          ${color} 80px,
          ${color} 81px
        )`,
        opacity,
        animation: 'waveSlide 12s linear infinite',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}

/* Twinkling dots scattered in background */
interface TwinkleDotsProps {
  count?: number
  color?: string
  size?: number
  style?: React.CSSProperties
}

export const TwinkleDots: React.FC<TwinkleDotsProps> = ({
  count = 12,
  color = colors.accent[400],
  size = 4,
  style = {},
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const positions = React.useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
      })),
    [count]
  )
  if (prefersReducedMotion) return null
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', ...style }}>
      {positions.map((pos, i) => (
        <div
          key={i}
          className="twinkle-dot"
          style={{
            position: 'absolute',
            left: pos.left,
            top: pos.top,
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.3,
            animation: `twinkle ${pos.duration}s ease-in-out infinite`,
            animationDelay: `${pos.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* Large floating soft orbs */
interface FloatingOrbProps {
  size?: number
  color?: string
  duration?: number
  delay?: number
  variant?: 1 | 2 | 3
  style?: React.CSSProperties
}

export const FloatingOrb: React.FC<FloatingOrbProps> = ({
  size = 250,
  color,
  duration = 22,
  delay = 0,
  variant = 1,
  style = {},
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const c = color || (variant === 1 ? colors.primary[100] : variant === 2 ? colors.secondary[100] : colors.accent[100])
  const anim = variant === 1 ? 'floatOrbSoft1' : variant === 2 ? 'floatOrbSoft2' : 'floatOrbSoft3'
  if (prefersReducedMotion) return null
  return (
    <div
      className="floating-orb-bg"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${c}50 0%, ${c}20 50%, transparent 70%)`,
        filter: 'blur(40px)',
        pointerEvents: 'none',
        animation: `${anim} ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.6,
        ...style,
      }}
    />
  )
}

interface ParallaxImageProps {
  src: string
  alt: string
  speed?: number
  className?: string
  style?: React.CSSProperties
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  speed = 0.5,
  className,
  style,
}) => {
  const [offset, setOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion) return

    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const elementTop = rect.top
        const elementHeight = rect.height

        // Calculate parallax offset when element is in viewport
        if (elementTop < windowHeight && elementTop + elementHeight > 0) {
          const scrolled = window.scrollY
          const elementOffset = elementTop + scrolled
          const parallaxOffset = (scrolled - elementOffset + windowHeight) * speed * 0.1
          setOffset(parallaxOffset)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, prefersReducedMotion])

  return (
    <div
      ref={containerRef}
      style={{
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
      className={className}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '120%', // Extra height for parallax effect
          objectFit: 'cover',
          transform: prefersReducedMotion ? 'none' : `translateY(${offset}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      />
    </div>
  )
}
