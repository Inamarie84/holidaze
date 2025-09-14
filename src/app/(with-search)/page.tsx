// src/app/(with-search)/page.tsx
import { getVenues } from '@/services/venues'
import VenueCard from '@/components/venue/VenueCard'

export default async function Home() {
  const venues = await getVenues({ _bookings: true, page: 1, limit: 12 })

  return (
    <main id="main">
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="h2 mb-4">Explore venues</h2>
          {venues.length === 0 ? (
            <p className="body muted">No venues found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map((v) => (
                <VenueCard key={v.id} venue={v} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
