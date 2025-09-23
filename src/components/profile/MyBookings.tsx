// src/components/profile/MyBookings.tsx
'use client'

import Link from 'next/link'
import type { TBooking } from '@/types/api'

type Props = {
  bookings: TBooking[]
  /** Shown when the list is empty */
  emptyText?: string
  /** Visual tone for the list (default normal). Use 'muted' for past bookings */
  tone?: 'default' | 'muted'
}

export default function MyBookings({
  bookings,
  emptyText,
  tone = 'default',
}: Props) {
  if (!bookings?.length) {
    return (
      <p className={`body ${tone === 'muted' ? 'muted' : ''}`}>
        {emptyText ?? 'No bookings yet.'}
      </p>
    )
  }

  const fmt = (d: string | Date) =>
    new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const isMuted = tone === 'muted'

  return (
    <ul
      className={[
        'divide-y divide-black/10 rounded-xl border border-black/10 bg-white',
        isMuted ? 'text-grey' : '',
      ].join(' ')}
    >
      {bookings.map((b) => {
        const v = b.venue
        return (
          <li key={b.id} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div
                  className={['font-semibold', isMuted ? 'text-grey' : ''].join(
                    ' '
                  )}
                >
                  {fmt(b.dateFrom)} – {fmt(b.dateTo)}
                </div>
                <div className="text-sm text-grey">
                  {b.guests} guest{b.guests > 1 ? 's' : ''}
                  {v ? ` • ${v.name}` : ''}
                </div>
              </div>

              {v && (
                <Link
                  href={`/venues/${v.id}`}
                  className={[
                    'text-sm underline hover:opacity-80',
                    isMuted ? 'text-grey' : '',
                  ].join(' ')}
                >
                  View venue
                </Link>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
