// src/components/venue/VenueList.tsx
import VenueCard from '@/components/venue/VenueCard'
import Pagination from '@/components/ui/Pagination'
import { getVenues, searchVenues } from '@/services/venues'
import type { TVenue } from '@/types/api'

const DEFAULT_LIMIT = 12

export type VenueSearchParams = {
  q?: string
  dateFrom?: string
  dateTo?: string
  guests?: string
  page?: string
  limit?: string
}

export default async function VenueList({
  sp,
  title = 'Explore venues',
}: {
  sp: VenueSearchParams
  title?: string
}) {
  const q = sp.q?.trim() || undefined
  const dateFrom = sp.dateFrom || undefined
  const dateTo = sp.dateTo || undefined
  const guests = sp.guests ? Number(sp.guests) : undefined
  const page = Math.max(1, Number(sp.page ?? '1'))
  const limit = Math.max(1, Number(sp.limit ?? String(DEFAULT_LIMIT)))
  const hasFilters = Boolean(q || dateFrom || dateTo || guests)

  let venues: TVenue[] = []

  if (hasFilters) {
    // Client-side filter (needs bookings for availability check)
    const all = await searchVenues({ q, dateFrom, dateTo, guests })
    const start = (page - 1) * limit
    venues = all.slice(start, start + limit)
  } else {
    // Server-side pagination when no filters set
    venues = await getVenues({ _bookings: true, page, limit })
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h2 className="h2">{title}</h2>
        </header>

        {venues.length === 0 ? (
          <p className="body muted">No venues found.</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map((v) => (
                <VenueCard
                  key={v.id}
                  venue={v as any}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                />
              ))}
            </div>

            {/* Your existing Pagination API */}
            <div className="mt-8 flex justify-center">
              <Pagination
                page={page}
                limit={limit}
                countThisPage={venues.length}
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
