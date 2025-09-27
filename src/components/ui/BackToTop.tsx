'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronUp } from 'lucide-react'

/**
 * Floating "Back to top" button that appears after scrolling down.
 * Uses rAF-throttled scroll handler and respects iOS safe areas.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 400)
        ticking.current = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-[70] inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald text-white shadow-lg border border-black/10 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald cursor-pointer"
      style={{
        right: 'max(1.5rem, env(safe-area-inset-right))',
        bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <ChevronUp size={20} aria-hidden />
      <span className="sr-only">Back to top</span>
    </button>
  )
}
