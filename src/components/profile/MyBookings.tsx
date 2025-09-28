import Link from 'next/link'
import type { ReactNode } from 'react'
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

/** Wraps row content in a Link when href is provided; otherwise a div. */
function RowWrapper({
  href,
  className,
  children,
}: {
  href?: string
  className?: string
  children: ReactNode
}) {
  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  )
}

/**
 * List of bookings with venue name, dates, guests, optional guest name,
 * and a single unified "row link" to the venue (no duplicate links).
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
        const venueHref = venueId ? `/venues/${venueId}` : undefined

        return (
          <li key={b.id} className="p-3 sm:p-4">
            {/* When venue exists, the entire row is a single link.
                This removes "Adjacent links to the same URL". */}
            <RowWrapper
              href={venueHref}
              className={
                venueHref
                  ? 'group flex items-center gap-3 no-underline focus:outline-none'
                  : 'flex items-center gap-3'
              }
            >
              {/* Thumbnail: decorative to avoid duplicating the venue name */}
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-sand">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
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
                  <span className="truncate font-medium group-hover:underline">
                    {venueName}
                  </span>
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

              {/* Right "CTA" – just styled text inside the same link (or plain text when no venue) */}
              <div className="shrink-0">
                <span className="inline-flex items-center justify-center rounded-lg border border-black/15 px-3 py-1.5 text-sm group-hover:bg-black/5">
                  View venue
                </span>
              </div>
            </RowWrapper>
          </li>
        )
      })}
    </ul>
  )
}
