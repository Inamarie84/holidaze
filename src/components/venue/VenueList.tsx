// src/components/venue/VenueList.tsx
import VenueCard from '@/components/venue/VenueCard'
import Pagination from '@/components/ui/Pagination'
import { getVenues } from '@/services/venues'
import { searchVenuesServer } from '@/services/venues.server'
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

/**
 * VenueList
 * - Unfiltered: uses Holidaze API directly (real meta)
 * - Filtered: uses our server route `/api/venues/search` (real meta)
 */
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

  const guestsNum = sp.guests ? Number(sp.guests) : undefined
  const guests =
    typeof guestsNum === 'number' && !Number.isNaN(guestsNum)
      ? guestsNum
      : undefined

  const page = Math.max(1, Number(sp.page ?? '1'))

  // 👇 clamp limit to [1, 100]
  const limitRaw = Number(sp.limit ?? String(DEFAULT_LIMIT))
  const limit = Math.max(
    1,
    Math.min(100, Number.isFinite(limitRaw) ? limitRaw : DEFAULT_LIMIT)
  )

  const hasFilters = Boolean(q || dateFrom || dateTo || guests)

  let venues: TVenue[] = []
  let pageCount = 1
  let totalCount = 0
  let hasPrev = page > 1
  let hasNext = false

  if (hasFilters) {
    // ✅ server-side filtered search with real meta
    const res = await searchVenuesServer({
      q,
      dateFrom,
      dateTo,
      guests,
      page,
      limit,
    })
    venues = (res.data ?? []) as TVenue[]
    pageCount = res.meta?.pageCount ?? 1
    totalCount = res.meta?.totalCount ?? venues.length
    hasPrev = res.meta?.isFirstPage === false || page > 1
    hasNext = res.meta?.isLastPage === false || page < pageCount
  } else {
    // Unfiltered: API meta from Holidaze
    const res = await getVenues({ _bookings: true, page, limit })
    venues = (res.data ?? []) as TVenue[]
    pageCount = res.meta?.pageCount ?? 1
    totalCount = res.meta?.totalCount ?? venues.length
    hasPrev = res.meta?.isFirstPage === false || page > 1
    hasNext = res.meta?.isLastPage === false || page < pageCount
  }

  const startIdx = totalCount === 0 ? 0 : (page - 1) * limit + 1
  const endIdx = Math.min(page * limit, totalCount)

  return (
    <section className="py-12" aria-labelledby="venue-list-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-2">
          <h2 id="venue-list-title" className="h2">
            {title}
          </h2>
          <p className="muted text-sm">
            {totalCount > 0
              ? `Showing ${startIdx}–${endIdx} of ${totalCount}${hasFilters ? ' (filtered)' : ''}`
              : 'No results'}
          </p>
        </header>

        {venues.length === 0 ? (
          <p className="body muted mt-6">No venues found.</p>
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

            <div className="mt-8 flex justify-center">
              <Pagination
                page={page}
                pageCount={pageCount}
                hasPrev={hasPrev}
                hasNext={hasNext}
                basePath="/venues"
                label="Venues pagination"
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
