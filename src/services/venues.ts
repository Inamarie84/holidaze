import { api } from '@/lib/api'
import { useSession } from '@/store/session'
import type {
  TVenue,
  TVenueWithBookings,
  TVenueInclude,
  UpsertVenueInput,
} from '@/types/api'

// Add generic query options (API supports these)
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

/** -------- List & read -------- */
export async function getVenues(params?: VenuesQuery): Promise<TVenue[]> {
  const query = toQuery({
    sort: 'created',
    sortOrder: 'desc',
    page: 1,
    limit: 24,
    ...params,
  })
  return api<TVenue[]>(`/holidaze/venues${query}`)
}

export function getVenueById(id: string): Promise<TVenue>
export function getVenueById(
  id: string,
  params: { _bookings?: true; _owner?: true } & TVenueInclude
): Promise<TVenueWithBookings & { owner?: { name?: string } }>
export async function getVenueById(id: string, params?: TVenueInclude) {
  const query = toQuery(params)
  return api(`/holidaze/venues/${id}${query}`)
}

/** -------- Client-side search -------- */
type SearchInput = {
  q?: string
  dateFrom?: string
  dateTo?: string
  guests?: number
  limit?: number | string
}

export async function searchVenues({
  q,
  dateFrom,
  dateTo,
  guests,
  limit = 100,
}: SearchInput): Promise<TVenueWithBookings[]> {
  const url = `/holidaze/venues?_bookings=true&sort=created&sortOrder=desc&limit=${limit}`
  const venues = await api<TVenueWithBookings[]>(url)

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
      const hay = `${norm(v.name)} ${norm(v.description)} ${norm(v.location?.city)} ${norm(v.location?.country)}`
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

/** -------- Manager CRUD -------- */
function requireManagerAuth() {
  const { token, user } = useSession.getState()
  if (!token) throw new Error('Not authenticated')
  if (!user?.venueManager)
    throw new Error('Only venue managers can perform this action')
  return { token, user }
}

export async function createVenue(input: UpsertVenueInput): Promise<TVenue> {
  const { token } = requireManagerAuth()
  return api<TVenue>('/holidaze/venues', {
    method: 'POST',
    token,
    useApiKey: true,
    body: input,
  })
}

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

export async function deleteVenue(id: string): Promise<void> {
  const { token } = requireManagerAuth()
  await api<void>(`/holidaze/venues/${id}`, {
    method: 'DELETE',
    token,
    useApiKey: true,
  })
}
