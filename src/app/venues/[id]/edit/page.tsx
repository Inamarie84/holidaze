// app/venues/[id]/edit/page.tsx
import EditVenuePageClient from './EditVenuePageClient'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Edit venue • Holidaze',
  description: 'Update your venue details',
}

type PageProps = { params: Promise<{ id: string }> }

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <EditVenuePageClient id={id} />
}
