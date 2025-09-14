// src/components/profile/ManagerVenues.tsx
'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { TVenue } from '@/types/api'
import VenueCard from '@/components/venue/VenueCard'

/**
 * ManagerVenues
 * Renders venue cards for a manager.
 *
 * Usage:
 *  - <ManagerVenues venues={array} />
 *  - <ManagerVenues ownerName="Ina" />
 */
type Props =
  | { venues: TVenue[]; ownerName?: never }
  | { ownerName: string; venues?: never }

// Type guards for clean narrowing
function hasVenuesProp(p: Props): p is { venues: TVenue[] } {
  return 'venues' in p
}
function hasOwnerNameProp(p: Props): p is { ownerName: string } {
  return 'ownerName' in p
}

export default function ManagerVenues(props: Props) {
  // if venues were provided, no loading; otherwise we’ll fetch by owner
  const [loading, setLoading] = useState(!hasVenuesProp(props))
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TVenue[]>(
    hasVenuesProp(props) ? props.venues : []
  )

  useEffect(() => {
    let mounted = true

    async function loadByOwner(ownerName: string) {
      try {
        setLoading(true)
        setError(null)
        const venues = await api<TVenue[]>(
          `/profiles/${encodeURIComponent(ownerName)}/venues?_bookings=true`
        )
        if (!mounted) return
        setData(Array.isArray(venues) ? venues : [])
      } catch (err: unknown) {
        if (!mounted) return
        const msg = err instanceof Error ? err.message : 'Failed to load venues'
        setError(msg)
      } finally {
        mounted && setLoading(false)
      }
    }

    if (hasOwnerNameProp(props)) {
      // props.ownerName is guaranteed string here
      loadByOwner(props.ownerName)
    } else if (hasVenuesProp(props)) {
      // If the caller swaps from fetch-mode to provided-venues, sync them
      setData(props.venues)
      setLoading(false)
    }

    return () => {
      mounted = false
    }
    // It’s safe to depend on the whole props object because the guards re-narrow
  }, [props])

  if (loading) return <p className="body muted">Loading your venues…</p>
  if (error) return <p className="body text-red-600">{error}</p>
  if (!data.length)
    return <p className="body muted">You haven’t created any venues yet.</p>

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((v) => (
        <VenueCard key={v.id} venue={v} />
      ))}
    </div>
  )
}
