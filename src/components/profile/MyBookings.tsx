// src/components/profile/MyBookings.tsx
'use client'

import type { TBooking } from '@/types/api'

type Props = { bookings: TBooking[] }

export default function MyBookings({ bookings }: Props) {
  if (!bookings?.length) {
    return <p className="body muted">No upcoming bookings yet.</p>
  }

  const fmt = (d: string | Date) =>
    new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  return (
    <ul className="divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
      {bookings.map((b) => {
        const v = b.venue
        return (
          <li key={b.id} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">
                  {fmt(b.dateFrom)} – {fmt(b.dateTo)}
                </div>
                <div className="text-sm text-grey">
                  {b.guests} guest{b.guests > 1 ? 's' : ''}
                  {v ? ` • ${v.name}` : ''}
                </div>
              </div>
              {v && (
                <a
                  href={`/venues/${v.id}`}
                  className="text-sm underline hover:opacity-80 cursor-pointer"
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
