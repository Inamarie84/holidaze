// src/app/(with-search)/loading.tsx
import VenueGridSkeleton from '@/components/venues/VenueGridSkeleton'

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <VenueGridSkeleton rows={2} cols={{ base: 1, sm: 2, lg: 3 }} />
    </main>
  )
}
