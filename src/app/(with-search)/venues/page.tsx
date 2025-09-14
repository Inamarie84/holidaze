// src/app/(with-search)/venues/page.tsx
import { getVenues } from '@/services/venues'
import VenueCard from '@/components/venue/VenueCard'

export const dynamic = 'force-dynamic' // always fetch fresh data

export default async function VenuesPage() {
  const venues = await getVenues({ _bookings: true, page: 1, limit: 12 })

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-6">
        <h1 className="h1">Venues</h1>
        <p className="muted mt-1">Browse all available stays</p>
      </header>

      {venues.length === 0 ? (
        <p className="body muted">No venues found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      )}
    </main>
  )
}
