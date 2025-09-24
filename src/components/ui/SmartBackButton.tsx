// src/components/ui/SmartBackButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

type Props = {
  label?: string
  fallback?: string
  className?: string
}

export default function SmartBackButton({
  label = 'Back',
  fallback = '/venues',
  className = '',
}: Props) {
  const router = useRouter()

  function goBack() {
    // 1) Real history back if there is at least one previous entry
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) {
      router.back()
      return
    }

    // 2) Our tracked previous in-app route
    const prev = sessionStorage.getItem('prevPath')
    const here = `${location.pathname}${location.search}`
    if (prev && prev !== here) {
      router.push(prev)
      return
    }

    // 3) Fallback
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
      <ArrowLeft size={18} aria-hidden="true" />
      <span className="body">{label}</span>
    </button>
  )
}
