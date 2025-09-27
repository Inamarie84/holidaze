import type { Metadata } from 'next'
import EditVenuePageClient from './EditVenuePageClient'
import { ENV } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Edit venue • Holidaze',
  description: 'Update your venue details',
}

export const dynamic = 'force-dynamic'

async function fetchVenueServer(id: string) {
  const url = `${ENV.API_URL}/holidaze/venues/${encodeURIComponent(id)}?_owner=true`
  const res = await fetch(url, {
    headers: { 'X-Noroff-API-Key': process.env.NEXT_PUBLIC_API_KEY ?? '' },
    cache: 'no-store',
    next: { revalidate: 0 },
  })
  if (!res.ok) return null
  const json = await res.json()
  return 'data' in json ? json.data : json
}

/** Server shell for the Edit Venue page. */
export default async function EditVenuePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const initialVenue = await fetchVenueServer(id) // may be null
  return <EditVenuePageClient id={id} initialVenue={initialVenue} />
}
