import 'server-only'
import { headers } from 'next/headers'
import type { TVenueWithBookings, TListResponse } from '@/types/api'

/**
 * Server-only venue search using your internal API route.
 *
 * @param params - Search filters and pagination
 * @returns Paginated list of venues (with bookings if your API adds them)
 * @throws Error if the API route responds with a non-OK status
 */
export async function searchVenuesServer(params: {
  q?: string
  dateFrom?: string
  dateTo?: string
  guests?: number | string
  page?: number | string
  limit?: number | string
}): Promise<TListResponse<TVenueWithBookings>> {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== '') usp.set(k, String(v))
  })

  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const origin = `${proto}://${host}`

  const res = await fetch(`${origin}/api/venues/search?${usp.toString()}`, {
    method: 'GET',
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Search failed')
  }

  return (await res.json()) as TListResponse<TVenueWithBookings>
}
