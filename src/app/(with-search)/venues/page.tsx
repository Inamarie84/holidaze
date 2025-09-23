// src/app/(with-search)/venues/page.tsx
import VenueList, { VenueSearchParams } from '@/components/venue/VenueList'

export const dynamic = 'force-dynamic'

type SP = Record<string, string | string[] | undefined>

export default async function VenuesPage({
  searchParams,
}: {
  // Next’s generated types for your app expect a Promise here
  searchParams: Promise<SP>
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
      {/* @ts-ignore: Async Server Component is valid in RSC, TS complains */}
      <VenueList sp={sp} title="All venues" />
    </main>
  )
}
