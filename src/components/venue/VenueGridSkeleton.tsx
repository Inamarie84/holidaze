// src/components/venues/VenueGridSkeleton.tsx
'use client'

import Skeleton from '@/components/ui/Skeleton'

type Cols = { base: number; sm?: number; lg?: number; xl?: number }

type Props = {
  /** Number of rows to render (at the largest breakpoint) */
  rows?: number
  /** Grid column counts per breakpoint */
  cols?: Cols
  /** Optional aria-label on the grid container */
  label?: string
}

function gridClass(cols: Cols) {
  const parts = ['grid gap-4', `grid-cols-${cols.base}`]
  if (cols.sm) parts.push(`sm:grid-cols-${cols.sm}`)
  if (cols.lg) parts.push(`lg:grid-cols-${cols.lg}`)
  if (cols.xl) parts.push(`xl:grid-cols-${cols.xl}`)
  return parts.join(' ')
}

/**
 * VenueGridSkeleton
 * Responsive grid of card skeletons matching list layout.
 */
export default function VenueGridSkeleton({
  rows = 2,
  cols = { base: 1, sm: 2, lg: 3 },
  label = 'Loading venues',
}: Props) {
  const perRow = cols.xl ?? cols.lg ?? cols.sm ?? cols.base
  const total = rows * perRow

  return (
    <div
      className={gridClass(cols)}
      aria-label={label}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: total }).map((_, i) => (
        <article
          key={i}
          className="overflow-hidden rounded-xl border border-black/10 bg-white"
          aria-hidden="true"
        >
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-28" />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
