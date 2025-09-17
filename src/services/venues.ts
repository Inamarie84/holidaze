// src/services/venues.ts
import { api } from '@/lib/api'
import { useSession } from '@/store/session'
import type { TVenue, TVenueWithBookings, TVenueInclude } from '@/types/api'

function toQuery(params?: TVenueInclude): string {
  if (!params) return ''
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    usp.set(k, String(v))
  })
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

/** -------- Existing: list & read -------- */
export async function getVenues(params?: TVenueInclude): Promise<TVenue[]> {
  const query = toQuery(params)
  return api<TVenue[]>(`/holidaze/venues${query}`)
}

// in services/venues.ts
// Read a single venue
export function getVenueById(id: string): Promise<TVenue>
export function getVenueById(
  id: string,
  params: { _bookings?: true; _owner?: true } & TVenueInclude
): Promise<TVenueWithBookings & { owner?: { name?: string } }>
export async function getVenueById(id: string, params?: TVenueInclude) {
  const query = toQuery(params)
  return api(`/holidaze/venues/${id}${query}`)
}

/** -------- Client-side search (yours) -------- */
type SearchInput = {
  q?: string
  dateFrom?: string
  dateTo?: string
  guests?: number
}

export async function searchVenues({
  q,
  dateFrom,
  dateTo,
  guests,
}: SearchInput): Promise<TVenueWithBookings[]> {
  const venues = await api<TVenueWithBookings[]>(
    '/holidaze/venues?_bookings=true'
  )

  const norm = (s: unknown) =>
    String(s ?? '')
      .toLowerCase()
      .trim()
  const from = dateFrom ? new Date(dateFrom) : null
  const to = dateTo ? new Date(dateTo) : null

  const overlaps = (bFrom: Date, bTo: Date) => {
    if (!from || !to) return false
    return !(to <= bFrom || from >= bTo)
  }

  return venues.filter((v) => {
    if (q) {
      const needle = norm(q)
      const hay = `${norm(v.name)} ${norm(v.description)} ${norm(
        v.location?.city
      )} ${norm(v.location?.country)}`
      if (!hay.includes(needle)) return false
    }
    if (guests && v.maxGuests < guests) return false
    if (from && to) {
      const hasOverlap = (v.bookings ?? []).some((b) =>
        overlaps(new Date(b.dateFrom), new Date(b.dateTo))
      )
      if (hasOverlap) return false
    }
    return true
  })
}

/** -------- NEW: manager CRUD helpers -------- */

function requireManagerAuth() {
  const { token, user } = useSession.getState()
  if (!token) throw new Error('Not authenticated')
  if (!user?.venueManager)
    throw new Error('Only venue managers can perform this action')
  return { token, user }
}

export type UpsertVenueInput = {
  name: string
  description?: string
  media?: { url: string; alt?: string }[]
  price: number
  maxGuests: number
  meta?: {
    wifi?: boolean
    parking?: boolean
    breakfast?: boolean
    pets?: boolean
  }
  location?: {
    address?: string
    city?: string
    zip?: string
    country?: string
    continent?: string
    lat?: number
    lng?: number
  }
}

/** Create */
export async function createVenue(input: UpsertVenueInput): Promise<TVenue> {
  const { token } = requireManagerAuth()
  return api<TVenue>('/holidaze/venues', {
    method: 'POST',
    token,
    useApiKey: true,
    body: input,
  })
}

/** Update */
export async function updateVenue(
  id: string,
  input: Partial<UpsertVenueInput>
): Promise<TVenue> {
  const { token } = requireManagerAuth()
  return api<TVenue>(`/holidaze/venues/${id}`, {
    method: 'PUT',
    token,
    useApiKey: true,
    body: input,
  })
}

/** Delete */
export async function deleteVenue(id: string): Promise<void> {
  const { token } = requireManagerAuth()
  await api<void>(`/holidaze/venues/${id}`, {
    method: 'DELETE',
    token,
    useApiKey: true,
  })
}
