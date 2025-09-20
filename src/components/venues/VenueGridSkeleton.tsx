// src/components/venues/VenueGridSkeleton.tsx
'use client'

import Skeleton from '@/components/ui/Skeleton'

type Cols = { base: number; sm?: number; lg?: number; xl?: number }
type Props = {
  /** how many rows of cards to render (at the largest breakpoint count) */
  rows?: number
  /** grid column counts per breakpoint */
  cols?: Cols
}

function gridClass(cols: Cols) {
  const parts = ['grid gap-4', `grid-cols-${cols.base}`]
  if (cols.sm) parts.push(`sm:grid-cols-${cols.sm}`)
  if (cols.lg) parts.push(`lg:grid-cols-${cols.lg}`)
  if (cols.xl) parts.push(`xl:grid-cols-${cols.xl}`)
  return parts.join(' ')
}

export default function VenueGridSkeleton({
  rows = 2,
  cols = { base: 1, sm: 2, lg: 3 },
}: Props) {
  // Use the largest defined column count to estimate total cards
  const perRow = cols.xl ?? cols.lg ?? cols.sm ?? cols.base
  const total = rows * perRow

  return (
    <div className={gridClass(cols)}>
      {Array.from({ length: total }).map((_, i) => (
        <article
          key={i}
          className="overflow-hidden rounded-xl border border-black/10 bg-white"
        >
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-2">
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
