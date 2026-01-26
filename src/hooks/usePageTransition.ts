import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export const usePageTransition = () => {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion) return

    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [location.pathname, prefersReducedMotion])

  return isTransitioning
}
