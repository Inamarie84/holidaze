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

/** Query options for venue list endpoints. */
export type VenuesQuery = TVenueInclude & {
  page?: number | string
  limit?: number | string
  sort?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Build a clean query string from a record of unknown values.
 *
 * @param params - Key/values to serialize
 * @returns Query string starting with `?` or an empty string
 */
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

/**
 * Fetch a paginated list of venues.
 *
 * @param params - Pagination and include flags
 * @returns Paginated response with venues
 * @throws Error if the API response is not OK
 */
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
 * Read a single venue (optionally including bookings/owner).
 *
 * @param id - Venue UUID
 * @param params - Include flags (e.g., {_bookings: true, _owner: true})
 * @param opts - Optional fetch options (e.g., { signal } to support aborts)
 * @returns The venue object (optionally with bookings and owner)
 * @throws Error if the response fails or JSON is invalid
 */
export async function getVenueById(
  id: string,
  params?: TVenueInclude,
  opts?: { signal?: AbortSignal }
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
    signal: opts?.signal,
  })

  const rawText = await res.text()
  if (!res.ok) {
    throw new Error(rawText || `Failed to fetch venue (${res.status})`)
  }

  try {
    const parsed = rawText ? JSON.parse(rawText) : null
    if (parsed && typeof parsed === 'object' && 'data' in parsed) {
      return (parsed as TItemResponse<TVenue | TVenueWithBookings>).data
    }
    return parsed as TVenue | TVenueWithBookings
  } catch {
    throw new Error('Invalid venue response')
  }
}

/* ------------------ MANAGER CRUD ------------------ */

/**
 * Ensure the current user is an authenticated venue manager.
 *
 * @returns A bearer token
 * @throws Error if no token or user is not a manager
 */
function requireManagerAuth(): { token: string } {
  const { token, user } = useSession.getState()
  if (!token) throw new Error('Not authenticated')
  if (!user?.venueManager)
    throw new Error('Only venue managers can perform this action')
  return { token }
}

/**
 * Create a venue (manager-only).
 *
 * @param input - Venue payload
 * @returns Created venue
 */
export async function createVenue(input: UpsertVenueInput): Promise<TVenue> {
  const { token } = requireManagerAuth()
  const res = await holidazeApi<TItemResponse<TVenue>>('/venues', {
    method: 'POST',
    body: input,
    token,
    unwrapData: false,
  })
  return res.data
}

/**
 * Update a venue (manager-only).
 *
 * @param id - Venue id
 * @param input - Partial payload to update
 * @returns Updated venue
 */
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

/**
 * Delete a venue (manager-only).
 *
 * @param id - Venue id
 * @returns Resolves when deletion succeeds
 */
export async function deleteVenue(id: string): Promise<void> {
  const { token } = requireManagerAuth()
  await holidazeApi<void>(`/venues/${id}`, { method: 'DELETE', token })
}
