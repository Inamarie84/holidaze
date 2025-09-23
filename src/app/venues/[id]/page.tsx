//src/app/venues/[id]/page.tsx

'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from '@/store/session'
import { getVenueById, deleteVenue } from '@/services/venues'
import type { TVenueWithBookings, TBooking } from '@/types/api'
import toast from 'react-hot-toast'
import { createBooking } from '@/services/bookings'
import AvailabilityCalendar from '@/components/venue/AvailabilityCalendar'
import SmartBackButton from '@/components/ui/SmartBackButton'
import VenueDetailSkeleton from '@/components/venue/VenueDetailSkeleton'
import Gallery from '@/components/venue/Gallery'
import BookingForm from '@/components/venue/BookingForm'

// When we fetch with _bookings=true&_owner=true, we’ll get bookings and owner
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
  const { token, user } = useSession()

  const [venue, setVenue] = useState<VenueWithExtras | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Gallery state
  const [activeIndex, setActiveIndex] = useState(0)

  // Booking form state
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [guests, setGuests] = useState<number | ''>('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const v = (await getVenueById(id, {
          _bookings: true,
          _owner: true,
        })) as VenueWithExtras
        if (!mounted) return
        setVenue(v)
        setActiveIndex(0)
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load venue')
      } finally {
        mounted && setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [id])

  const isManager = !!user?.venueManager
  const isOwner = isManager && venue?.owner?.name === user?.name
  const canBook = !!token && !isManager

  type Interval = { from: Date; to: Date; guests: number }
  const bookedIntervals = useMemo<Interval[]>(() => {
    const list = venue?.bookings ?? []
    return list.map((b: TBooking) => ({
      from: new Date(b.dateFrom),
      to: new Date(b.dateTo),
      guests: b.guests,
    }))
  }, [venue])

  function overlapsDesired(fromISO: string, toISO: string) {
    if (!fromISO || !toISO) return false
    const from = new Date(fromISO)
    const to = new Date(toISO)
    return bookedIntervals.some((bi) => !(to <= bi.from || from >= bi.to))
  }

  async function onBook(e: React.FormEvent) {
    e.preventDefault()
    if (!venue) return
    if (!canBook) {
      toast.error('Please log in to book this venue.')
      router.push('/login?role=customer')
      return
    }
    const guestsNum = typeof guests === 'string' ? Number(guests) : guests
    if (!dateFrom || !dateTo) return toast.error('Please pick your dates.')
    if (!guestsNum || guestsNum < 1)
      return toast.error('Guests must be at least 1.')
    if (guestsNum > venue.maxGuests)
      return toast.error(`Max guests for this venue is ${venue.maxGuests}.`)
    if (new Date(dateTo) <= new Date(dateFrom))
      return toast.error('Check-out must be after check-in.')
    if (overlapsDesired(dateFrom, dateTo))
      return toast.error('Selected dates overlap an existing booking.')

    try {
      setBookingLoading(true)
      await createBooking({
        dateFrom: new Date(dateFrom).toISOString(),
        dateTo: new Date(dateTo).toISOString(),
        guests: guestsNum,
        venueId: venue.id,
      })
      toast.success('Booking created!')
      router.push('/profile')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create booking'
      )
    } finally {
      setBookingLoading(false)
    }
  }

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

  // ----- RENDER STATES -----
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

      {/* Title ABOVE the image */}
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

      {/* Gallery */}
      <Gallery
        images={images}
        venueName={venue.name}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
        className="mb-8"
      />

      {/* Availability + Booking */}
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

      {/* About / Amenities */}
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
