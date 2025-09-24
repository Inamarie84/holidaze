// src/app/(with-search)/venues/page.tsx
import VenueList, { VenueSearchParams } from '@/components/venue/VenueList'

export const dynamic = 'force-dynamic'

export default async function VenuesPage({
  searchParams,
}: {
  // match Next’s generated types
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const spIn = await searchParams
  const toStr = (v: unknown) => (typeof v === 'string' ? v : undefined)

  const sp: VenueSearchParams = {
    q: toStr(spIn.q),
    dateFrom: toStr(spIn.dateFrom),
    dateTo: toStr(spIn.dateTo),
    guests: toStr(spIn.guests),
    page: toStr(spIn.page) ?? '1',
    limit: toStr(spIn.limit) ?? '12',
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <VenueList sp={sp} title="All venues" />
    </main>
  )
}
