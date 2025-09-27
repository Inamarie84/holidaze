// app/venues/[id]/edit/page.tsx
import type { Metadata } from 'next'
import EditVenuePageClient from './EditVenuePageClient'

// Static, route-level metadata → emitted in the initial <head>
export const metadata: Metadata = {
  title: 'Edit venue • Holidaze',
  description: 'Update your venue details',
}

// NOTE: Your Next 15 route types expect Promise-based params here.
type PageProps = { params: Promise<{ id: string }> }

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <EditVenuePageClient id={id} />
}
