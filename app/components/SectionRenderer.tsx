'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, MapPin, Calendar, ExternalLink, Star, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { ThemeConfig, getBlockStyleCSS } from '../../lib/themes'
import { 
  Section, 
  AboutSectionData, 
  RetreatSectionData, 
  GallerySectionData, 
  VideoSectionData, 
  TestimonialsSectionData,
  isAboutSection,
  isRetreatSection,
  isGallerySection,
  isVideoSection,
  isTestimonialsSection,
} from '../../lib/sections'
import { RetreatIcon3D, QuoteIcon3D, VideoIcon3D } from './Icons3D'

// ============================================
// ABOUT ME SECTION
// ============================================

interface AboutSectionProps {
  data: AboutSectionData
  theme: ThemeConfig
  index: number
}

export function AboutSection({ data, theme, index }: AboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [data.description])

  const cardStyle = getBlockStyleCSS(theme.blockStyle, theme)

  return (
    <div
      className="section-about cursor-pointer"
      style={{
        ...cardStyle,
        animationDelay: `${index * 0.1}s`,
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      data-testid="section-about"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-semibold"
          style={{
            color: theme.textPrimary,
            fontFamily: theme.fontPairing.heading,
          }}
        >
          {data.title}
        </h3>
        <ChevronDown
          className="w-5 h-5 transition-transform duration-300"
          style={{
            color: theme.textSecondary,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>

      {/* Expandable Content */}
      <div
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{
          maxHeight: isExpanded ? `${contentHeight + 20}px` : '0px',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="pt-4">
          <p
            className="leading-relaxed"
            style={{
              color: theme.textSecondary,
              fontFamily: theme.fontPairing.body,
            }}
          >
            {data.description}
          </p>
          
          {data.highlightQuote && (
            <blockquote
              className="mt-4 pl-4 border-l-2 italic"
              style={{
                borderColor: theme.accent,
                color: theme.textPrimary,
              }}
            >
              "{data.highlightQuote}"
            </blockquote>
          )}
        </div>
      </div>

      {/* Preview text when collapsed */}
      {!isExpanded && (
        <p
          className="mt-2 text-sm line-clamp-2"
          style={{ color: theme.textSecondary }}
        >
          {data.description.substring(0, 100)}...
        </p>
      )}
    </div>
  )
}

// ============================================
// RETREAT/EVENT SECTION
// ============================================

interface RetreatSectionProps {
  data: RetreatSectionData
  theme: ThemeConfig
  index: number
}

function CountdownTimer({ targetDate, theme }: { targetDate: string; theme: ThemeConfig }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        })
      }
    }
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(timer)
  }, [targetDate])

  const isPast = new Date(targetDate).getTime() < new Date().getTime()

  if (isPast) {
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: theme.accentLight,
          color: theme.accent,
        }}
      >
        Completed
      </span>
    )
  }

  return (
    <div className="flex gap-3 mt-3">
      {[
        { value: timeLeft.days, label: 'days' },
        { value: timeLeft.hours, label: 'hrs' },
        { value: timeLeft.minutes, label: 'min' },
      ].map((item) => (
        <div
          key={item.label}
          className="text-center px-3 py-2 rounded-lg"
          style={{ backgroundColor: theme.accentLight }}
        >
          <div
            className="text-xl font-bold"
            style={{ color: theme.accent }}
          >
            {item.value}
          </div>
          <div
            className="text-xs"
            style={{ color: theme.textSecondary }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export function RetreatSection({ data, theme, index }: RetreatSectionProps) {
  const cardStyle = getBlockStyleCSS(theme.blockStyle, theme)

  return (
    <div
      className="section-retreat"
      style={{
        ...cardStyle,
        padding: '24px',
        animationDelay: `${index * 0.1}s`,
      }}
      data-testid="section-retreat"
    >
      {/* Event Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🏕️</span>
        <span
          className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            background: theme.headerGradient || theme.buttonPrimary,
            color: theme.buttonPrimaryText,
          }}
        >
          Upcoming Event
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-xl font-bold mb-2"
        style={{
          color: theme.textPrimary,
          fontFamily: theme.fontPairing.heading,
        }}
      >
        {data.eventTitle}
      </h3>

      {/* Location & Date */}
      <div className="flex flex-wrap gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-sm" style={{ color: theme.textSecondary }}>
          <MapPin className="w-4 h-4" />
          {data.location}
        </div>
        <div className="flex items-center gap-1.5 text-sm" style={{ color: theme.textSecondary }}>
          <Calendar className="w-4 h-4" />
          {new Date(data.date).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      </div>

      {/* Description */}
      <p
        className="text-sm mb-4"
        style={{
          color: theme.textSecondary,
          fontFamily: theme.fontPairing.body,
        }}
      >
        {data.description}
      </p>

      {/* Countdown */}
      {data.showCountdown && <CountdownTimer targetDate={data.date} theme={theme} />}

      {/* CTA Button */}
      <a
        href={data.ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: theme.headerGradient || theme.buttonPrimary,
          color: theme.buttonPrimaryText,
          boxShadow: `0 4px 14px ${theme.accent}40`,
        }}
      >
        {data.ctaText}
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  )
}

// ============================================
// IMAGE GALLERY SECTION
// ============================================

interface GallerySectionProps {
  data: GallerySectionData
  theme: ThemeConfig
  index: number
}

export function GallerySection({ data, theme, index }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (!data.images || data.images.length === 0) {
    return null
  }

  const cardStyle = getBlockStyleCSS(theme.blockStyle, theme)

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx)
    setLightboxOpen(true)
  }

  return (
    <>
      <div
        className="section-gallery"
        style={{
          ...cardStyle,
          padding: '16px',
          animationDelay: `${index * 0.1}s`,
        }}
        data-testid="section-gallery"
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{
            color: theme.textPrimary,
            fontFamily: theme.fontPairing.heading,
          }}
        >
          🖼️ Gallery
        </h3>

        {data.layout === 'slider' ? (
          // Slider Layout
          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {data.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-full cursor-pointer"
                    onClick={() => openLightbox(idx)}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || `Gallery image ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-xl"
                      loading="lazy"
                    />
                    {img.caption && (
                      <p
                        className="text-sm text-center mt-2"
                        style={{ color: theme.textSecondary }}
                      >
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {data.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity"
                  style={{
                    backgroundColor: theme.cardBackground,
                    opacity: currentIndex === 0 ? 0.5 : 1,
                  }}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: theme.textPrimary }} />
                </button>
                <button
                  onClick={() => setCurrentIndex(Math.min(data.images.length - 1, currentIndex + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity"
                  style={{
                    backgroundColor: theme.cardBackground,
                    opacity: currentIndex === data.images.length - 1 ? 0.5 : 1,
                  }}
                  disabled={currentIndex === data.images.length - 1}
                >
                  <ChevronRight className="w-5 h-5" style={{ color: theme.textPrimary }} />
                </button>
              </>
            )}

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-3">
              {data.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: idx === currentIndex ? theme.accent : theme.cardBorder,
                    transform: idx === currentIndex ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          // Grid Layout
          <div className="grid grid-cols-2 gap-2">
            {data.images.map((img, idx) => (
              <div
                key={idx}
                className="cursor-pointer overflow-hidden rounded-lg"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={img.url}
                  alt={img.caption || `Gallery image ${idx + 1}`}
                  className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
          <img
            src={data.images[lightboxIndex].url}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain"
          />
          {data.images.length > 1 && (
            <>
              <button
                className="absolute left-4 text-white p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((lightboxIndex - 1 + data.images.length) % data.images.length)
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                className="absolute right-4 text-white p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((lightboxIndex + 1) % data.images.length)
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}

// ============================================
// YOUTUBE VIDEO SECTION
// ============================================

interface VideoSectionProps {
  data: VideoSectionData
  theme: ThemeConfig
  index: number
}

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
  }
  return null
}

export function VideoSection({ data, theme, index }: VideoSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const embedUrl = getYouTubeEmbedUrl(data.youtubeUrl)
  const cardStyle = getBlockStyleCSS(theme.blockStyle, theme)

  if (!embedUrl) {
    return null
  }

  return (
    <div
      className="section-video"
      style={{
        ...cardStyle,
        padding: '16px',
        animationDelay: `${index * 0.1}s`,
      }}
      data-testid="section-video"
    >
      {data.title && (
        <h3
          className="text-lg font-semibold mb-2"
          style={{
            color: theme.textPrimary,
            fontFamily: theme.fontPairing.heading,
          }}
        >
          🎥 {data.title}
        </h3>
      )}

      {data.description && (
        <p
          className="text-sm mb-3"
          style={{ color: theme.textSecondary }}
        >
          {data.description}
        </p>
      )}

      {/* Video Container with 16:9 ratio */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          paddingBottom: '56.25%',
          backgroundColor: theme.category === 'dark' ? '#1a1a1a' : '#f0f0f0',
        }}
      >
        {!isLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={() => setIsLoaded(true)}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.buttonPrimary }}
            >
              <Play className="w-8 h-8 ml-1" style={{ color: theme.buttonPrimaryText }} />
            </div>
          </div>
        )}
        
        {isLoaded && (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
    </div>
  )
}

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================

interface TestimonialsSectionProps {
  data: TestimonialsSectionData
  theme: ThemeConfig
  index: number
}

export function TestimonialsSection({ data, theme, index }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!data.autoSlide || data.testimonials.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [data.autoSlide, data.testimonials.length, isPaused])

  if (!data.testimonials || data.testimonials.length === 0) {
    return null
  }

  const cardStyle = getBlockStyleCSS(theme.blockStyle, theme)
  const testimonial = data.testimonials[currentIndex]

  return (
    <div
      className="section-testimonials"
      style={{
        ...cardStyle,
        padding: '20px',
        animationDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-testid="section-testimonials"
    >
      <div className="text-center mb-4">
        <span className="text-2xl">💬</span>
        <h3
          className="text-lg font-semibold mt-2"
          style={{
            color: theme.textPrimary,
            fontFamily: theme.fontPairing.heading,
          }}
        >
          What People Say
        </h3>
      </div>

      {/* Testimonial Card with Fade */}
      <div className="relative min-h-[140px]">
        <div
          key={currentIndex}
          className="testimonial-fade"
          style={{
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          {/* Quote */}
          <p
            className="italic text-center mb-4 leading-relaxed"
            style={{
              color: theme.textPrimary,
              fontFamily: theme.fontPairing.body,
            }}
          >
            "{testimonial.quote}"
          </p>

          {/* Author */}
          <div className="flex items-center justify-center gap-3">
            {testimonial.image ? (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                style={{
                  backgroundColor: theme.accentLight,
                  color: theme.accent,
                }}
              >
                {testimonial.name.charAt(0)}
              </div>
            )}
            <div>
              <p
                className="font-semibold text-sm"
                style={{ color: theme.textPrimary }}
              >
                {testimonial.name}
              </p>
              {testimonial.rating && (
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3"
                      style={{
                        fill: i < testimonial.rating! ? '#FFC107' : 'transparent',
                        color: i < testimonial.rating! ? '#FFC107' : theme.cardBorder,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      {data.testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {data.testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: idx === currentIndex ? theme.accent : theme.cardBorder,
                transform: idx === currentIndex ? 'scale(1.25)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// MAIN SECTION RENDERER
// ============================================

interface SectionRendererProps {
  section: Section
  theme: ThemeConfig
  index: number
}

export function SectionRenderer({ section, theme, index }: SectionRendererProps) {
  if (!section.enabled) return null

  switch (section.type) {
    case 'about':
      if (isAboutSection(section.data)) {
        return <AboutSection data={section.data} theme={theme} index={index} />
      }
      break
    case 'retreat':
      if (isRetreatSection(section.data)) {
        return <RetreatSection data={section.data} theme={theme} index={index} />
      }
      break
    case 'gallery':
      if (isGallerySection(section.data)) {
        return <GallerySection data={section.data} theme={theme} index={index} />
      }
      break
    case 'video':
      if (isVideoSection(section.data)) {
        return <VideoSection data={section.data} theme={theme} index={index} />
      }
      break
    case 'testimonials':
      if (isTestimonialsSection(section.data)) {
        return <TestimonialsSection data={section.data} theme={theme} index={index} />
      }
      break
  }

  return null
}

export default SectionRenderer
