import EditVenuePageClient from './EditVenuePageClient'
import { ENV } from '@/lib/env'

export const dynamic = 'force-dynamic'

async function fetchVenueServer(id: string) {
  const url = `${ENV.API_URL}/holidaze/venues/${encodeURIComponent(id)}?_owner=true`
  const res = await fetch(url, {
    headers: { 'X-Noroff-API-Key': process.env.NEXT_PUBLIC_API_KEY ?? '' },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const json = await res.json()
  return 'data' in json ? json.data : json
}

type PageProps = { params: Promise<{ id: string }> }

const Page = async ({ params }: PageProps) => {
  const { id } = await params
  const initialVenue = await fetchVenueServer(id)
  return <EditVenuePageClient id={id} initialVenue={initialVenue} />
}

export default Page
