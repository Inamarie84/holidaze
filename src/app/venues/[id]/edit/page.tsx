// app/venues/[id]/edit/page.tsx
import type { Metadata } from 'next'
import EditVenuePageClient from './EditVenuePageClient'

type PageProps = { params: Promise<{ id: string }> }

// ❌ Do NOT export: export const dynamic = 'force-dynamic'
// (Removing this avoids late head patches.)

// Static route metadata → emitted in initial <head>
export const metadata: Metadata = {
  title: 'Edit venue • Holidaze',
  description: 'Update your venue details',
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  // Render a tiny server element first to encourage an early head commit
  // (harmless, accessibility-neutral)
  // If you don’t want it, you can remove the <div>; the metadata still works.
  return (
    <>
      <div className="sr-only" aria-hidden />
      <EditVenuePageClient id={id} />
    </>
  )
}
