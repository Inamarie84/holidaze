import type { Metadata } from 'next'
import VenueDetailsPageClient from './VenueDetailsPageClient'
import { holidazeApi } from '@/lib/holidaze'
import type { TVenue } from '@/types/api'

type Params = { params: Promise<{ id: string }> }

// Optional: dynamic to avoid SSG for this route
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  try {
    const v = await holidazeApi<TVenue>(`/venues/${id}`, { method: 'GET' })
    return {
      title: v?.name ? `${v.name}` : 'Venue',
      description: v?.description?.slice(0, 150),
      openGraph: {
        title: v?.name ?? 'Venue',
        description: v?.description?.slice(0, 150),
        images: v?.media?.[0]?.url ? [{ url: v.media[0].url }] : undefined,
      },
    }
  } catch {
    return { title: 'Venue', description: 'Venue details' }
  }
}

export default async function Page({ params }: Params) {
  const { id } = await params
  return <VenueDetailsPageClient id={id} />
}
