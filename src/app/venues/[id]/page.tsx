// app/venues/[id]/page.tsx
import VenueDetailsPageClient from './VenueDetailsPageClient'

type PageProps = { params: Promise<{ id: string }> }
export const dynamic = 'force-dynamic'

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <VenueDetailsPageClient id={id} />
}
