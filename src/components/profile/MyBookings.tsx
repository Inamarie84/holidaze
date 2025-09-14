// src/components/profile/MyBookings.tsx
'use client'

import type { TBooking } from '@/types/api'

type Props = { bookings: TBooking[] }

export default function MyBookings({ bookings }: Props) {
  if (!bookings?.length) {
    return <p className="body muted">No upcoming bookings yet.</p>
  }

  return (
    <ul className="divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
      {bookings.map((b) => {
        const v = b.venue
        return (
          <li key={b.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  {new Date(b.dateFrom).toLocaleDateString()} –{' '}
                  {new Date(b.dateTo).toLocaleDateString()}
                </div>
                <div className="text-sm text-grey">
                  {b.guests} guest{b.guests > 1 ? 's' : ''}
                  {v ? ` • ${v.name}` : ''}
                </div>
              </div>
              {v && (
                <a
                  href={`/venues/${v.id}`}
                  className="text-sm underline hover:opacity-80"
                >
                  View venue
                </a>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
