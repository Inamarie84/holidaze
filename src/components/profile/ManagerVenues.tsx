'use client'

import Link from 'next/link'
import type { TVenue } from '@/types/api'

export default function ManagerVenues({ venues }: { venues: TVenue[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="h3">My venues</h3>
        <Link
          href="/manage" // later you can point to a specific create page
          className="rounded-lg bg-emerald px-3 py-2 text-white hover:opacity-90"
        >
          Create venue
        </Link>
      </div>

      {!venues.length ? (
        <p className="muted">You haven’t created any venues yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <li
              key={v.id}
              className="rounded-lg border border-black/10 p-4 hover:bg-sand"
            >
              <div className="font-semibold">{v.name}</div>
              <div className="text-sm text-grey">
                {v.city ?? v.location?.city ?? ''} • {v.price} NOK/night
              </div>
              <div className="mt-2">
                <Link
                  href={`/venues/${v.id}`}
                  className="text-sm underline hover:opacity-80"
                >
                  View
                </Link>
                {/* Later: Edit/Delete actions */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
