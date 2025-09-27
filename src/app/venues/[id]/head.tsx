// app/venues/[id]/head.tsx
import { holidazeApi } from '@/lib/holidaze'
import type { TVenue } from '@/types/api'

type Props = { params: Promise<{ id: string }> }

export default async function Head({ params }: Props) {
  const { id } = await params

  // Defaults
  let title = 'Venue'
  let description = 'Venue details'
  let imageUrl: string | undefined

  try {
    const v = await holidazeApi<TVenue>(`/venues/${id}`, { method: 'GET' })
    if (v) {
      title = v.name || title
      description = (v.description || description).slice(0, 150)
      imageUrl = v.media?.[0]?.url
    }
  } catch (err) {
    // Keep safe defaults; optionally surface in dev only (no noisy logs in prod)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('Head: failed to load venue metadata', err)
    }
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </>
  )
}
