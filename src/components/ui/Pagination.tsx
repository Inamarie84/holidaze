'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  page: number
  limit: number
  countThisPage: number
  label?: string
}

export default function Pagination({
  page,
  limit,
  countThisPage,
  label = 'Pagination',
}: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const hasPrev = page > 1
  // heuristic: if we got a full page, assume there might be another page
  const hasNext = countThisPage === limit

  function go(to: number) {
    const usp = new URLSearchParams(params.toString())
    usp.set('page', String(to))
    router.push(`/venues?${usp.toString()}`)
  }

  if (!hasPrev && !hasNext) return null

  return (
    <nav
      aria-label={label}
      className="mt-8 flex items-center justify-center gap-3"
    >
      <button
        disabled={!hasPrev}
        onClick={() => go(page - 1)}
        className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-sand disabled:opacity-50 cursor-pointer"
      >
        ← Previous
      </button>
      <span className="body text-sm">Page {page}</span>
      <button
        disabled={!hasNext}
        onClick={() => go(page + 1)}
        className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-sand disabled:opacity-50 cursor-pointer"
      >
        Next →
      </button>
    </nav>
  )
}
