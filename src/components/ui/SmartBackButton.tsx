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
    try {
      const ref = document.referrer
      const sameOrigin = !!ref && new URL(ref).origin === window.location.origin
      if (sameOrigin) router.back()
      else router.push(fallback)
    } catch {
      router.push(fallback)
    }
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={[
        'inline-flex items-center gap-2 rounded-lg border border-black/15',
        'px-3 py-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-emerald',
        className,
      ].join(' ')}
    >
      <ArrowLeft size={18} aria-hidden="true" />
      <span className="body">{label}</span>
    </button>
  )
}
