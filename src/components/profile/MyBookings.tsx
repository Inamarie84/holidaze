'use client'

/**
 * MyBookings
 * Fetches bookings for a customer profile and renders a compact list.
 *
 * Props:
 * - customerName: the profile name whose bookings to list
 */

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { TBooking, TVenue } from '@/types/api'
import Link from 'next/link'

type BookingWithVenue = TBooking & { venue?: TVenue }

export default function MyBookings({ customerName }: { customerName: string }) {
  const [bookings, setBookings] = useState<BookingWithVenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        // Include venue so we can link to it
        const data = await api<BookingWithVenue[]>(
          `/profiles/${encodeURIComponent(customerName)}/bookings?_venue=true`
        )
        if (mounted) setBookings(Array.isArray(data) ? data : [])
      } catch (err: unknown) {
        if (mounted) {
          const msg =
            err instanceof Error ? err.message : 'Failed to load bookings'
          setError(msg)
        }
      } finally {
        mounted && setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [customerName])

  if (loading) return <p className="body muted">Loading your bookings…</p>
  if (error) return <p className="body text-red-600">{error}</p>
  if (!bookings.length)
    return <p className="body muted">No upcoming bookings.</p>

  return (
    <ul className="divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
      {bookings.map((b) => {
        const from = new Date(b.dateFrom)
        const to = new Date(b.dateTo)
        const nights = Math.max(
          0,
          Math.round((+to - +from) / (1000 * 60 * 60 * 24))
        )
        const venueName = b.venue?.name ?? 'Venue'
        const venueLink = b.venue ? `/venues/${b.venue.id}` : undefined

        return (
          <li key={b.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold">
                  {venueLink ? (
                    <Link href={venueLink} className="hover:underline">
                      {venueName}
                    </Link>
                  ) : (
                    venueName
                  )}
                </div>
                <div className="muted text-sm">
                  {from.toLocaleDateString()} – {to.toLocaleDateString()} •{' '}
                  {b.guests} guest{b.guests > 1 ? 's' : ''}{' '}
                  {nights ? `• ${nights} night${nights > 1 ? 's' : ''}` : ''}
                </div>
              </div>
              {b.venue?.price ? (
                <div className="text-sm">
                  <span className="muted">Est. total:&nbsp;</span>
                  <b>{nights * b.venue.price} NOK</b>
                </div>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
