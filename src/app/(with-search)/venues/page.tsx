import type { Metadata } from 'next'
import VenueList, { type VenueSearchParams } from '@/components/venue/VenueList'

export const metadata: Metadata = {
  title: 'Venues',
  description: 'Browse all venues',
}

// Force dynamic so search results always reflect latest filters/data
export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

/**
 * Venues index with server-side param normalization.
 */
export default function VenuesPage({ searchParams }: PageProps) {
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v

  const sp: VenueSearchParams = {
    q: first(searchParams.q),
    dateFrom: first(searchParams.dateFrom),
    dateTo: first(searchParams.dateTo),
    guests: first(searchParams.guests),
    page: first(searchParams.page) ?? '1',
    limit: first(searchParams.limit) ?? '12',
  }

  return (
    <section
      aria-labelledby="venues-heading"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <h2 id="venues-heading" className="sr-only">
        All venues
      </h2>
      <VenueList sp={sp} title="All venues" />
    </section>
  )
}
