// src/components/profile/MyBookings.tsx
import Link from 'next/link'
import type { TBooking } from '@/types/api'

type Props = {
  bookings: TBooking[]
  emptyText?: string
  tone?: 'default' | 'muted'
  /** Show the guest (customer) who made the booking, when available (manager view) */
  showGuest?: boolean
}

function getThumbUrl(b: TBooking): string | undefined {
  const url = b.venue?.media?.[0]?.url
  return typeof url === 'string' && url.trim() ? url : undefined
}

export default function MyBookings({
  bookings,
  emptyText = 'No bookings.',
  tone = 'default',
  showGuest = false,
}: Props) {
  if (!bookings?.length) {
    return (
      <p className={`body ${tone === 'muted' ? 'muted' : ''}`}>{emptyText}</p>
    )
  }

  return (
    <ul className="divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
      {bookings.map((b) => {
        const thumb = getThumbUrl(b)
        const start = b.dateFrom?.slice(0, 10)
        const end = b.dateTo?.slice(0, 10)
        const venueId = b.venue?.id
        const venueName = b.venue?.name ?? 'Venue'

        return (
          <li key={b.id} className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              {/* Thumbnail */}
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-sand">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={`${venueName} thumbnail`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs muted">
                    No image
                  </div>
                )}
              </div>

              {/* Content (left) */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  {/* Venue name stays a link */}
                  {venueId ? (
                    <Link
                      href={`/venues/${venueId}`}
                      className="truncate font-medium hover:underline"
                      title={venueName}
                    >
                      {venueName}
                    </Link>
                  ) : (
                    <span className="truncate font-medium">{venueName}</span>
                  )}
                  <span className="muted text-sm">
                    {start} – {end}
                  </span>
                </div>

                {/* Optional guest name (manager view) */}
                {showGuest && b.customer?.name && (
                  <div className="text-sm muted">Guest: {b.customer.name}</div>
                )}

                {/* Guests count */}
                {typeof b.guests === 'number' && (
                  <div className="text-sm">
                    {b.guests} {b.guests === 1 ? 'guest' : 'guests'}
                  </div>
                )}
              </div>

              {/* Right action: explicit View venue button */}
              <div className="shrink-0">
                {venueId ? (
                  <Link
                    href={`/venues/${venueId}`}
                    className="inline-flex items-center justify-center rounded-lg border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5 cursor-pointer"
                    aria-label={`View ${venueName}`}
                  >
                    View venue
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg border border-black/15 px-3 py-1.5 text-sm opacity-50 cursor-not-allowed"
                    aria-disabled="true"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
