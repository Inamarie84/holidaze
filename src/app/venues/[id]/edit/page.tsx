// src/app/venues/[id]/edit/page.tsx
import type { Metadata } from 'next'
import EditVenuePageClient from './EditVenuePageClient'
import { ENV } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Edit venue • Holidaze',
  description: 'Update your venue details',
}

// Keep this if you want it dynamic
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

// ✅ Important: use a concrete prop type and a const component
type PageProps = { params: Promise<{ id: string }> }

const Page = async ({ params }: PageProps) => {
  const { id } = await params
  const initialVenue = await fetchVenueServer(id) // may be null
  return <EditVenuePageClient id={id} initialVenue={initialVenue} />
}

export default Page
