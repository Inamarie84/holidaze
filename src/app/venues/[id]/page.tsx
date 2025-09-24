// src/app/venues/[id]/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from '@/store/session'
import { getVenueById, deleteVenue } from '@/services/venues'
import type { TVenueWithBookings } from '@/types/api'
import toast from 'react-hot-toast'
import AvailabilityCalendar from '@/components/venue/AvailabilityCalendar'
import SmartBackButton from '@/components/ui/SmartBackButton'
import VenueDetailSkeleton from '@/components/venue/VenueDetailSkeleton'
import Gallery from '@/components/venue/Gallery'
import BookingForm from '@/components/venue/BookingForm/BookingForm'

type VenueWithExtras = TVenueWithBookings & { owner?: { name?: string } }

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-sm">
      {children}
    </span>
  )
}

export default function VenueDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useSession()

  const [venue, setVenue] = useState<VenueWithExtras | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const v = (await getVenueById(id, {
          _bookings: true,
          _owner: true,
        })) as VenueWithExtras
        if (!alive) return
        setVenue(v)
        setActiveIndex(0)
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'Failed to load venue')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  const isManager = !!user?.venueManager
  const isOwner = isManager && venue?.owner?.name === user?.name

  async function onDeleteVenue() {
    if (!venue || !isOwner) return
    if (!confirm('Delete this venue? This cannot be undone.')) return
    try {
      await deleteVenue(venue.id)
      toast.success('Venue deleted')
      router.push('/profile')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete venue')
    }
  }

  if (loading) return <VenueDetailSkeleton />

  if (error || !venue) {
    return (
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="body text-red-600">{error ?? 'Venue not found'}</p>
      </main>
    )
  }

  const images = (venue.media ?? []).filter((m) => m?.url)

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-3">
        <SmartBackButton className="mb-2" fallback="/venues" />
      </div>

      <header className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="h1">{venue.name}</h1>
          <p className="muted">
            {venue.location?.city ?? ''}
            {venue.location?.city && venue.location?.country ? ', ' : ''}
            {venue.location?.country ?? ''}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Chip>{venue.price} NOK / night</Chip>
          <Chip>Max {venue.maxGuests} guests</Chip>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                href={`/venues/${venue.id}/edit`}
                className="inline-flex items-center rounded-lg border border-black/15 px-3 py-1.5 hover:bg-black/5"
              >
                Edit
              </Link>
              <button
                onClick={onDeleteVenue}
                className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-white hover:opacity-90 cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      <Gallery
        images={images}
        venueName={venue.name}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
        className="mb-8"
      />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h3 className="h3 mb-3">Availability</h3>
          <AvailabilityCalendar bookings={venue.bookings ?? []} />
          <p className="muted text-xs mt-2">
            * Check-out day is available for new check-ins.
          </p>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h3 className="h3 mb-4">Book this venue</h3>
          <BookingForm
            venue={{
              id: venue.id,
              name: venue.name,
              price: venue.price,
              maxGuests: venue.maxGuests,
              bookings: venue.bookings,
            }}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="h3 mb-2">About</h2>
        <p className="body">
          {venue.description || 'No description provided.'}
        </p>
      </section>

      <section className="mt-6">
        <h3 className="h3 mb-2">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {venue.meta?.wifi && <Chip>Wi-Fi</Chip>}
          {venue.meta?.parking && <Chip>Parking</Chip>}
          {venue.meta?.breakfast && <Chip>Breakfast</Chip>}
          {venue.meta?.pets && <Chip>Pets</Chip>}
          {!venue.meta && <p className="muted">No amenities listed.</p>}
        </div>
      </section>
    </main>
  )
}
