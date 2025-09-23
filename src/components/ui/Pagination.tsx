// src/components/ui/Pagination.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  /** current page (1-based) */
  page: number
  /** total page count */
  pageCount: number
  /** flags derived from API meta or computed locally */
  hasPrev: boolean
  hasNext: boolean
  /** region label for screen readers */
  label?: string
  /** optional override for the base path (default: /venues) */
  basePath?: string
}

/**
 * Pagination
 * Uses API meta when available; falls back to computed flags.
 */
export default function Pagination({
  page,
  pageCount,
  hasPrev,
  hasNext,
  label = 'Pagination',
  basePath = '/venues',
}: Props) {
  const router = useRouter()
  const params = useSearchParams()

  function go(to: number) {
    const usp = new URLSearchParams(params.toString())
    usp.set('page', String(to))
    router.push(`${basePath}?${usp.toString()}`)
  }

  if (pageCount <= 1) return null

  return (
    <nav
      aria-label={label}
      className="mt-4 flex items-center justify-center gap-3"
    >
      <button
        type="button"
        disabled={!hasPrev}
        onClick={() => go(page - 1)}
        className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-sand disabled:opacity-50"
      >
        ← Previous
      </button>

      <span className="body text-sm" aria-live="polite">
        Page {page} of {pageCount}
      </span>

      <button
        type="button"
        disabled={!hasNext}
        onClick={() => go(page + 1)}
        className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-sand disabled:opacity-50"
      >
        Next →
      </button>
    </nav>
  )
}
