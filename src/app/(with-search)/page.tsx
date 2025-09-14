// src/app/(with-search)/page.tsx
import VenueList, { VenueSearchParams } from '@/components/venue/VenueList'

export default async function Home({
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
    <main id="main">
      {/* @ts-expect-error Async Server Component */}
      <VenueList sp={sp} title="Explore venues" />
    </main>
  )
}
