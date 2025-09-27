'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { TVenue, TVenueWithBookings } from '@/types/api'

type Props = {
  venue: TVenue | TVenueWithBookings
  /** If provided with both dates and the venue has bookings, show availability badge */
  dateFrom?: string
  dateTo?: string
}

function hasBookings(
  v: TVenue | TVenueWithBookings
): v is TVenueWithBookings & {
  bookings: NonNullable<TVenueWithBookings['bookings']>
} {
  return Array.isArray((v as TVenueWithBookings).bookings)
}

function isAvailable(
  venue: TVenue | TVenueWithBookings,
  from?: string,
  to?: string
) {
  if (!from || !to) return null
  if (!hasBookings(venue)) return null

  const fromD = new Date(from)
  const toD = new Date(to)
  const overlaps = (bFrom: Date, bTo: Date) => !(toD <= bFrom || fromD >= bTo)
  const hasOverlap = venue.bookings.some((b) =>
    overlaps(new Date(b.dateFrom), new Date(b.dateTo))
  )
  return hasOverlap ? 'booked' : 'available'
}

/**
 * Lightweight venue card used in lists/grids.
 */
export default function VenueCard({ venue, dateFrom, dateTo }: Props) {
  const image = venue.media?.[0]?.url || '/images/placeholder.jpg'
  const alt = venue.media?.[0]?.alt || venue.name
  const badge = isAvailable(venue, dateFrom, dateTo)

  return (
    <Link
      href={`/venues/${venue.id}`}
      aria-label={`View venue: ${venue.name}`}
      className={[
        'group cursor-pointer overflow-hidden rounded-lg border border-black/10 transition',
        'hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald/50',
        'block',
      ].join(' ')}
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
              badge === 'available'
                ? 'bg-emerald text-white'
                : 'bg-[#e07a5f] text-white'
            }`}
          >
            {badge === 'available' ? 'Available' : 'Booked'}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="h3 mb-1 line-clamp-1 underline-offset-4 group-hover:underline">
          {venue.name}
        </h3>
        <p className="body text-sm text-grey line-clamp-2">
          {venue.description || 'No description provided.'}
        </p>

        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="font-semibold">{venue.price} NOK</span>
          <span className="text-grey">Max {venue.maxGuests} guests</span>
        </div>
      </div>
    </Link>
  )
}
