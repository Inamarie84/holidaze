// app/venues/[id]/edit/page.tsx
import EditVenuePageClient from './EditVenuePageClient'

// ❌ Remove this line entirely:
// export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ id: string }> }

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <EditVenuePageClient id={id} />
}
