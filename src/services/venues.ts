// src/services/venues.ts
import { holidazeApi } from '@/lib/holidaze'
import { useSession } from '@/store/session'
import { ENV } from '@/lib/env'
import type {
  TVenue,
  TVenueWithBookings,
  TVenueInclude,
  UpsertVenueInput,
  TListResponse,
  TItemResponse,
} from '@/types/api'

export type VenuesQuery = TVenueInclude & {
  page?: number | string
  limit?: number | string
  sort?: string
  sortOrder?: 'asc' | 'desc'
}

function toQuery(params?: Record<string, unknown>): string {
  if (!params) return ''
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    usp.set(k, String(v))
  })
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

/* ------------------ LIST & READ ------------------ */

export async function getVenues(
  params?: VenuesQuery
): Promise<TListResponse<TVenue>> {
  const page = params?.page !== undefined ? Math.max(1, Number(params.page)) : 1
  const limitInput = params?.limit !== undefined ? Number(params.limit) : 12
  const limit = Math.max(1, Math.min(100, limitInput))

  const query = toQuery({
    sort: 'created',
    sortOrder: 'desc',
    page,
    limit,
    ...params,
  })

  const res = await fetch(`${ENV.API_URL}/holidaze/venues${query}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': process.env.NEXT_PUBLIC_API_KEY ?? '',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Failed to fetch venues (${res.status})`)
  }

  return (await res.json()) as TListResponse<TVenue>
}

/**
 * Read one venue (optionally including bookings/owner).
 * Uses a direct fetch (like getVenues) to keep response shape consistent
 * during client-side navigation.
 */
export async function getVenueById(
  id: string,
  params?: TVenueInclude
): Promise<TVenue | (TVenueWithBookings & { owner?: { name?: string } })> {
  const query = toQuery(params)
  const url = `${ENV.API_URL}/holidaze/venues/${encodeURIComponent(id)}${query}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': process.env.NEXT_PUBLIC_API_KEY ?? '',
    },
    cache: 'no-store',
  })

  const rawText = await res.text()
  if (!res.ok) {
    throw new Error(rawText || `Failed to fetch venue (${res.status})`)
  }

  // Holidaze can return { data, meta? } or the raw venue object—handle both.
  try {
    const parsed = rawText ? (JSON.parse(rawText) as unknown) : null
    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed !== null &&
      'data' in parsed
    ) {
      return (parsed as TItemResponse<TVenue | TVenueWithBookings>).data
    }
    return parsed as TVenue | TVenueWithBookings
  } catch {
    throw new Error('Invalid venue response')
  }
}

/* ------------------ MANAGER CRUD ------------------ */

function requireManagerAuth(): { token: string } {
  const { token, user } = useSession.getState()
  if (!token) throw new Error('Not authenticated')
  if (!user?.venueManager)
    throw new Error('Only venue managers can perform this action')
  return { token }
}

export async function createVenue(input: UpsertVenueInput): Promise<TVenue> {
  const { token } = requireManagerAuth()
  // Ask for the full envelope and unwrap locally
  const res = await holidazeApi<TItemResponse<TVenue>>('/venues', {
    method: 'POST',
    body: input,
    token,
    unwrapData: false,
  })
  return res.data
}

export async function updateVenue(
  id: string,
  input: Partial<UpsertVenueInput>
): Promise<TVenue> {
  const { token } = requireManagerAuth()
  const res = await holidazeApi<TItemResponse<TVenue>>(`/venues/${id}`, {
    method: 'PUT',
    body: input,
    token,
    unwrapData: false,
  })
  return res.data
}

export async function deleteVenue(id: string): Promise<void> {
  const { token } = requireManagerAuth()
  await holidazeApi<void>(`/venues/${id}`, { method: 'DELETE', token })
}
