'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export const usePageTransition = () => {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname, prefersReducedMotion])

  return isTransitioning
}
