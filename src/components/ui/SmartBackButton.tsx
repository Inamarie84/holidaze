'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

type Props = {
  label?: string
  /** Fallback path if history is empty and no prevPath in sessionStorage */
  fallback?: string
  className?: string
}

/**
 * Smarter "Back" button that tries:
 * 1) real history back (if available)
 * 2) previously tracked in-app route (sessionStorage)
 * 3) a provided fallback (default: /venues)
 */
export default function SmartBackButton({
  label = 'Back',
  fallback = '/venues',
  className = '',
}: Props) {
  const router = useRouter()

  function goBack() {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) return router.back()

    const prev = sessionStorage.getItem('prevPath')
    const here = `${location.pathname}${location.search}`
    if (prev && prev !== here) return router.push(prev)

    router.push(fallback)
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={[
        'inline-flex items-center gap-2 rounded-lg border border-black/15',
        'px-3 py-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-emerald cursor-pointer',
        className,
      ].join(' ')}
    >
      <ArrowLeft size={18} aria-hidden />
      <span className="body">{label}</span>
    </button>
  )
}
