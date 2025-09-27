import VenueList, { VenueSearchParams } from '@/components/venue/VenueList'

export const metadata = { title: 'Venues', description: 'Browse all venues' }
export const dynamic = 'force-dynamic'

export default async function VenuesPage({
  searchParams,
}: {
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
