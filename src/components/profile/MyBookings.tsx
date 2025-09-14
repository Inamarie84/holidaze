'use client'

import type { TBooking } from '@/types/api'

export default function MyBookings({ bookings }: { bookings: TBooking[] }) {
  if (!bookings.length) {
    return <p className="muted">You have no upcoming bookings.</p>
  }
  return (
    <ul className="divide-y divide-black/10 rounded-lg border border-black/10 bg-white">
      {bookings.map((b) => (
        <li key={b.id} className="p-4">
          <div className="font-medium">
            {new Date(b.dateFrom).toLocaleDateString()} →{' '}
            {new Date(b.dateTo).toLocaleDateString()}
          </div>
          <div className="text-sm text-grey">
            {b.guests} guest{b.guests > 1 ? 's' : ''}
          </div>
          {b.venue && (
            <div className="mt-1 text-sm">
              Venue: <span className="font-medium">{b.venue.name}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
