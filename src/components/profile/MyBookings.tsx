// src/components/profile/MyBookings.tsx

import Link from 'next/link'
import type { TBooking } from '@/types/api'

/**
 * Format a Date or ISO string to a nice, local date like "20 Sep 2025".
 */
function fmtDate(d: string | Date) {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Returns the number of nights between two ISO dates (end exclusive).
 */
function nightsBetween(fromISO: string, toISO: string) {
  const from = new Date(fromISO)
  const to = new Date(toISO)
  const ms = to.getTime() - from.getTime()
  return ms > 0 ? Math.floor(ms / (1000 * 60 * 60 * 24)) : 0
}

/**
 * Split bookings into upcoming (check-in is today or later) and past.
 */
function splitBookings(bookings: TBooking[]) {
  const today = new Date()
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  const upcoming: TBooking[] = []
  const past: TBooking[] = []

  for (const b of bookings) {
    const checkIn = new Date(b.dateFrom)
    if (checkIn >= startOfToday) upcoming.push(b)
    else past.push(b)
  }

  // Newest first for past, soonest first for upcoming
  upcoming.sort((a, b) => +new Date(a.dateFrom) - +new Date(b.dateFrom))
  past.sort((a, b) => +new Date(b.dateFrom) - +new Date(a.dateFrom))

  return { upcoming, past }
}

type Props = {
  /**
   * Bookings array. For best UX, fetch with `_venue=true` so each booking includes its venue.
   * Example: GET /holidaze/profiles/:name/bookings?_venue=true
   */
  bookings: TBooking[]
  /** Hide the "Past bookings" section (defaults to false). */
  hidePast?: boolean
}

/**
 * MyBookings
 *
 * Renders the user's bookings with clear separation of "Upcoming" and "Past".
 * - Shows venue name (if included), dates, nights, and guests.
 * - Links to the venue detail page when we have `booking.venue`.
 */
export default function MyBookings({ bookings, hidePast = false }: Props) {
  const { upcoming, past } = splitBookings(bookings)

  const Section = ({
    title,
    items,
    emptyText,
  }: {
    title: string
    items: TBooking[]
    emptyText: string
  }) => (
    <section className="mt-8">
      <h2 className="h2 mb-3">{title}</h2>

      {items.length === 0 ? (
        <p className="muted">{emptyText}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => {
            const venueName = b.venue?.name ?? 'Venue'
            const venueId = b.venue?.id
            const dates = `${fmtDate(b.dateFrom)} – ${fmtDate(b.dateTo)}`
            const nights = nightsBetween(b.dateFrom, b.dateTo)

            return (
              <li
                key={b.id}
                className="rounded-lg border border-black/10 p-4 bg-white"
              >
                <div className="mb-1 text-sm text-grey">
                  {nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : '—'}
                  {' · '}
                  {b.guests} guest{b.guests > 1 ? 's' : ''}
                </div>

                {venueId ? (
                  <Link
                    href={`/venues/${venueId}`}
                    className="h3 block hover:underline"
                  >
                    {venueName}
                  </Link>
                ) : (
                  <div className="h3">{venueName}</div>
                )}

                <div className="mt-1 body text-sm">{dates}</div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )

  return (
    <div>
      <Section
        title="Upcoming bookings"
        items={upcoming}
        emptyText="You have no upcoming bookings."
      />
      {!hidePast && (
        <Section
          title="Past bookings"
          items={past}
          emptyText="No past bookings yet."
        />
      )}
    </div>
  )
}
