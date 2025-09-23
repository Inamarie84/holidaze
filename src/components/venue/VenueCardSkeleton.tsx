// src/components/venue/VenueCardSkeleton.tsx
'use client'

import Skeleton from '@/components/ui/Skeleton'

/**
 * VenueCardSkeleton
 * Card-shaped skeleton used inside venue grids/lists.
 */
export default function VenueCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-xl border border-black/10 bg-white">
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
  )
}
