//app/components/venue/VenueDetailSkeleton.tsx

'use client'
import Skeleton from '@/components/ui/Skeleton'

export default function VenueDetailSkeleton() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Title row */}
      <div className="mb-3">
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Main image */}
      <Skeleton className="aspect-[16/9] w-full rounded-xl mb-8" />

      {/* Two-column: calendar + booking card */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <Skeleton className="h-5 w-40 mb-3" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(42)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
          <div className="mt-3 flex gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <Skeleton className="h-5 w-48 mb-4" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <Skeleton className="h-10 w-1/2 mb-3" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* About / amenities */}
      <section className="mt-10">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </section>
    </main>
  )
}
