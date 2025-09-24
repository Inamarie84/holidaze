// src/components/venue/VenueList.tsx
import Pagination from '@/components/ui/Pagination'
import VenueCard from '@/components/venue/VenueCard'
import { getVenues } from '@/services/venues'
import { searchVenuesServer } from '@/services/venues.server'
import type { TVenue } from '@/types/api'
import type { ReactElement } from 'react' // ⬅️ add this

const DEFAULT_LIMIT = 12

export type VenueSearchParams = {
  q?: string
  dateFrom?: string
  dateTo?: string
  guests?: string
  page?: string
  limit?: string
}

type Props = { sp: VenueSearchParams; title?: string }

// --- Async implementation (not exported as default) ---
async function VenueListImpl({ sp, title = 'Explore venues' }: Props) {
  const q = sp.q?.trim() || undefined
  const dateFrom = sp.dateFrom || undefined
  const dateTo = sp.dateTo || undefined

  const guestsNum = sp.guests ? Number(sp.guests) : undefined
  const guests =
    typeof guestsNum === 'number' && !Number.isNaN(guestsNum)
      ? guestsNum
      : undefined

  const page = Math.max(1, Number(sp.page ?? '1'))

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
                  venue={v}
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

// Export a sync-typed wrapper so call-sites don’t trip over async JSX
export default function VenueList(props: Props): ReactElement {
  const SyncImpl = VenueListImpl as unknown as (p: Props) => ReactElement
  return <SyncImpl {...props} />
}
