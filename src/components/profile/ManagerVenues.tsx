'use client'

/**
 * ManagerVenues
 * Fetches venues owned by a profile (manager) and renders VenueCard list.
 *
 * Props:
 * - ownerName: the profile name whose venues to list
 */

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { TVenue } from '@/types/api'
import VenueCard from '@/components/venue/VenueCard'

export default function ManagerVenues({ ownerName }: { ownerName: string }) {
  const [venues, setVenues] = useState<TVenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        // List venues for this profile. _bookings helps show availability badges if you pass dates.
        const data = await api<TVenue[]>(
          `/profiles/${encodeURIComponent(ownerName)}/venues?_owner=true&_bookings=true`
        )
        if (mounted) setVenues(Array.isArray(data) ? data : [])
      } catch (err: unknown) {
        if (mounted) {
          const msg =
            err instanceof Error ? err.message : 'Failed to load venues'
          setError(msg)
        }
      } finally {
        mounted && setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [ownerName])

  if (loading) return <p className="body muted">Loading your venues…</p>
  if (error) return <p className="body text-red-600">{error}</p>
  if (!venues.length)
    return <p className="body muted">You haven’t created any venues yet.</p>

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {venues.map((v) => (
        <VenueCard key={v.id} venue={v} />
      ))}
    </div>
  )
}
