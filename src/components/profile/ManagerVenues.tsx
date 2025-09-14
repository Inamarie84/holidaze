// src/components/profile/ManagerVenues.tsx
'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useSession } from '@/store/session'
import type { TVenue } from '@/types/api'
import VenueCard from '@/components/venue/VenueCard'

type Props =
  | { venues: TVenue[]; ownerName?: never }
  | { ownerName: string; venues?: never }

function hasVenuesProp(p: Props): p is { venues: TVenue[] } {
  return 'venues' in p
}
function hasOwnerNameProp(p: Props): p is { ownerName: string } {
  return 'ownerName' in p
}

export default function ManagerVenues(props: Props) {
  const { token } = useSession()

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
          `/holidaze/profiles/${encodeURIComponent(ownerName)}/venues?_bookings=true`,
          { token }
        )
        if (!mounted) return
        setData(Array.isArray(venues) ? venues : [])
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load venues')
      } finally {
        mounted && setLoading(false)
      }
    }

    if (hasOwnerNameProp(props)) {
      if (!token) return
      loadByOwner(props.ownerName)
    } else if (hasVenuesProp(props)) {
      setData(props.venues)
      setLoading(false)
    }

    return () => {
      mounted = false
    }
  }, [props, token])

  if (hasOwnerNameProp(props) && !token) {
    return <p className="body muted">Please log in to view your venues.</p>
  }

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
