import type { Metadata } from 'next'
import VenueDetailsPageClient from './VenueDetailsPageClient'
import { holidazeApi } from '@/lib/holidaze'
import type { TVenue } from '@/types/api'

export const dynamic = 'force-dynamic'

type PageParams = { params: { id: string } }

/** Build OG/SEO metadata from the venue when possible. */
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { id } = params
  try {
    const v = await holidazeApi<TVenue>(`/venues/${id}`, { method: 'GET' })
    const desc = v?.description?.slice(0, 150)
    return {
      title: v?.name ? `${v.name}` : 'Venue',
      description: desc,
      openGraph: {
        title: v?.name ?? 'Venue',
        description: desc,
        images: v?.media?.[0]?.url ? [{ url: v.media[0].url }] : undefined,
      },
    }
  } catch {
    return { title: 'Venue', description: 'Venue details' }
  }
}

/** Server shell that passes the id to the client component. */
export default function Page({ params }: PageParams) {
  return <VenueDetailsPageClient id={params.id} />
}
