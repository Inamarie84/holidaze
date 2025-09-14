// src/app/(with-search)/venues/page.tsx
import VenueList, { VenueSearchParams } from '@/components/venue/VenueList'

export const dynamic = 'force-dynamic'

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const spRaw = await searchParams
  const sp: VenueSearchParams = {
    q: typeof spRaw.q === 'string' ? spRaw.q : undefined,
    dateFrom: typeof spRaw.dateFrom === 'string' ? spRaw.dateFrom : undefined,
    dateTo: typeof spRaw.dateTo === 'string' ? spRaw.dateTo : undefined,
    guests: typeof spRaw.guests === 'string' ? spRaw.guests : undefined,
    page: typeof spRaw.page === 'string' ? spRaw.page : '1',
    limit: typeof spRaw.limit === 'string' ? spRaw.limit : '12',
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* @ts-expect-error Async Server Component */}
      <VenueList sp={sp} title="All venues" />
    </main>
  )
}
