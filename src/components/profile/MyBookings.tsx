import Link from 'next/link'
import type { TBooking } from '@/types/api'

type Props = {
  bookings: TBooking[]
  emptyText?: string
  tone?: 'default' | 'muted'
  /** Show the guest (customer) who made the booking, when available (manager view). */
  showGuest?: boolean
}

/** Small helper to get a venue thumbnail URL, when present. */
function getThumbUrl(b: TBooking): string | undefined {
  const url = b.venue?.media?.[0]?.url
  return typeof url === 'string' && url.trim() ? url : undefined
}

/**
 * List of bookings with venue name, dates, guests, optional guest name,
 * and a "View venue" action.
 */
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
                  // eslint-disable-next-line @next/next/no-img-element
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

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
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

                {showGuest && b.customer?.name && (
                  <div className="text-sm muted">Guest: {b.customer.name}</div>
                )}

                {typeof b.guests === 'number' && (
                  <div className="text-sm">
                    {b.guests} {b.guests === 1 ? 'guest' : 'guests'}
                  </div>
                )}
              </div>

              {/* Right action */}
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
