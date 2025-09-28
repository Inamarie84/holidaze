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
 * Accessibility helper:
 * - If the provided alt equals the nearby label (e.g., venue name in the heading)
 *   OR the image is a placeholder, return an empty string to make the image decorative.
 * - Decorative images should use alt="" per WCAG 2.x SC 1.1.1 (Non-text Content)
 *   to avoid duplicate announcements by screen readers.
 */
function safeAlt(
  altText: string | undefined,
  label: string,
  isPlaceholder: boolean
) {
  if (isPlaceholder) return ''
  if (!altText) return ''
  return altText.trim().toLowerCase() === label.trim().toLowerCase()
    ? ''
    : altText
}

/**
 * Lightweight venue card used in lists/grids.
 *
 * Accessibility notes:
 * - The card image is typically decorative in a list/grid because the *heading* provides the name.
 *   => we compute alt via `safeAlt`, which returns "" when it would duplicate the heading or when using a placeholder.
 * - Let the <Link> name come from its content (the heading). Avoid `aria-label` on the whole card,
 *   which can mask visible text or create name/description mismatches.
 * - On detail pages (not this card), if an image conveys information, give a descriptive alt
 *   (e.g., "Exterior view of {venue.name} at sunset"), not just the venue name.
 */
export default function VenueCard({ venue, dateFrom, dateTo }: Props) {
  const image = venue.media?.[0]?.url || '/images/placeholder.jpg'
  const providedAlt = venue.media?.[0]?.alt || venue.name
  const isPlaceholder = image.endsWith('/images/placeholder.jpg')
  const alt = safeAlt(providedAlt, venue.name, isPlaceholder)

  const badge = isAvailable(venue, dateFrom, dateTo)
  const titleId = `venue-${venue.id}-title`

  return (
    <Link
      href={`/venues/${venue.id}`}
      className={[
        'group cursor-pointer overflow-hidden rounded-lg border border-black/10 transition',
        'hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald/50',
        'block',
      ].join(' ')}
      // Optionally be explicit:
      // aria-labelledby={titleId}
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={image}
          alt={alt} // '' => decorative to avoid duplicate with heading; otherwise descriptive (not just the venue name)
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
        <h3
          id={titleId}
          className="h3 mb-1 line-clamp-1 underline-offset-4 group-hover:underline"
        >
          {venue.name}
        </h3>
        <p className="body text-sm muted line-clamp-2">
          {venue.description || 'No description provided.'}
        </p>

        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="font-semibold">{venue.price} NOK</span>
          <span className="muted">Max {venue.maxGuests} guests</span>
        </div>
      </div>
    </Link>
  )
}
