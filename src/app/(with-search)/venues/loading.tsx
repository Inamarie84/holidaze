import VenueGridSkeleton from '@/components/venue/VenueGridSkeleton'

/**
 * Route-level loading UI for /venues.
 * Mirrors the grid layout to avoid layout shift.
 */
export default function Loading() {
  return (
    <section
      aria-label="Loading venues"
      aria-busy="true"
      aria-live="polite"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
    >
      <VenueGridSkeleton rows={2} cols={{ base: 1, sm: 2, lg: 3 }} />
    </section>
  )
}
