'use client'

import Skeleton from '@/components/ui/Skeleton'

export default function VenueDetailSkeleton() {
  return (
    <section
      className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading venue details"
    >
      {/* Title row */}
      <div className="mb-3">
        <Skeleton className="mb-2 h-8 w-1/2" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Main image */}
      <Skeleton className="mb-8 aspect-[16/9] w-full rounded-xl" />

      {/* Two-column: calendar + booking card */}
      <div className="grid gap-6 md:grid-cols-2">
        <section
          className="rounded-xl border border-black/10 bg-white p-4"
          aria-label="Availability"
        >
          <Skeleton className="mb-3 h-5 w-40" />
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 42 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
          <div className="mt-3 flex gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        </section>

        <section
          className="rounded-xl border border-black/10 bg-white p-4"
          aria-label="Booking"
        >
          <Skeleton className="mb-4 h-5 w-48" />
          <div className="mb-3 grid grid-cols-2 gap-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <Skeleton className="mb-3 h-10 w-1/2" />
          <Skeleton className="h-10 w-32" />
        </section>
      </div>

      {/* About / amenities */}
      <section className="mt-10" aria-label="About venue">
        <Skeleton className="mb-2 h-6 w-32" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </section>
    </section>
  )
}
