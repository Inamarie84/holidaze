'use client'

import Link from 'next/link'

/**
 * Success panel shown immediately after a confirmed booking.
 */
export default function JustBookedPanel() {
  return (
    <div className="mt-3 rounded-lg border border-emerald/30 bg-sand px-3 py-2">
      <p className="body">🎉 Booking confirmed! What next?</p>
      <div className="mt-2 flex gap-2">
        <Link
          href="/profile?tab=bookings"
          className="inline-flex items-center rounded-md bg-emerald px-3 py-1.5 text-white hover:opacity-90"
        >
          Upcoming bookings
        </Link>
        <Link
          href="/profile"
          className="inline-flex items-center rounded-md border border-black/15 px-3 py-1.5 hover:bg-black/5"
        >
          Go to profile
        </Link>
      </div>
    </div>
  )
}
