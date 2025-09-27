'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  /** Current page (1-based) */
  page: number
  /** Total page count */
  pageCount: number
  /** Flags derived from API meta or computed locally */
  hasPrev: boolean
  hasNext: boolean
  /** Region label for screen readers */
  label?: string
  /** Optional override for the base path (default: /venues) */
  basePath?: string
}

/**
 * Accessible pager that keeps/updates query params and only toggles `page`.
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
        className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-sand disabled:opacity-50 cursor-pointer"
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
        className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-sand disabled:opacity-50 cursor-pointer"
      >
        Next →
      </button>
    </nav>
  )
}
