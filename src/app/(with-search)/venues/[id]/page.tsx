// src/app/(with-search)/venues/[id]/page.tsx
import { getVenueById } from '@/services/venues'
import type { TVenue, TVenueWithBookings } from '@/types/api'
import Image from 'next/image'
import AvailabilityCalendar from '@/components/venue/AvailabilityCalendar'
import BookingForm from '@/components/venue/BookingForm' // client component

type Params = { id: string }

export default async function VenueDetail({
  params,
}: {
  params: Promise<Params> // Next 15: params is a Promise
}) {
  const { id } = await params

  // Ask for bookings so we can show calendar + validate dates in the form
  const venue = (await getVenueById(id, { _bookings: true })) as
    | TVenue
    | TVenueWithBookings

  const image = venue.media?.[0]?.url || '/images/placeholder.jpg'
  const alt = venue.media?.[0]?.alt || venue.name

  const hasBookings = (
    v: TVenue | TVenueWithBookings
  ): v is TVenueWithBookings =>
    'bookings' in v && Array.isArray((v as TVenueWithBookings).bookings)

  const bookings = hasBookings(venue) ? venue.bookings : []

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Media */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-black/10">
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Details + Calendar + Booking */}
        <div>
          <h1 className="h1 mb-2">{venue.name}</h1>
          <p className="body text-grey mb-4">{venue.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="font-semibold">{venue.price} NOK</div>
              <div className="text-grey">Per night</div>
            </div>
            <div>
              <div className="font-semibold">Max {venue.maxGuests}</div>
              <div className="text-grey">Guests</div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="h3 mb-2">Availability</h2>
            <AvailabilityCalendar bookings={bookings} />
          </div>

          <BookingForm
            venue={{
              id,
              name: venue.name,
              price: venue.price,
              maxGuests: venue.maxGuests,
              bookings, // ok if empty
            }}
          />
        </div>
      </div>
    </main>
  )
}
