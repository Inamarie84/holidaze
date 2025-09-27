import { api } from '@/lib/api'
import { useSession } from '@/store/session'
import type { TBooking, TBookingInclude } from '@/types/api'

/**
 * Build a clean query string from optional include flags.
 *
 * @param params - Include flags (e.g., {_venue: true, _customer: true})
 * @returns Query string starting with `?` or an empty string
 */
function toQuery(params?: TBookingInclude): string {
  if (!params) return ''
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    usp.set(k, String(v))
  })
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

/**
 * Ensure an authenticated session exists.
 *
 * @returns Token and user object from the session store
 * @throws Error if not authenticated
 */
function requireAuth() {
  const { token, user } = useSession.getState()
  if (!token) throw new Error('Not authenticated')
  return { token, user }
}

/**
 * Auth guard that only allows customers (non-managers).
 *
 * @returns Token and user object from the session store
 * @throws Error if not authenticated or user is a venue manager
 */
function requireCustomerAuth() {
  const { token, user } = requireAuth()
  if (user?.venueManager) {
    throw new Error('Only customers can perform this action')
  }
  return { token, user }
}

/**
 * Fetch bookings (auth required).
 *
 * @param params - Include flags (e.g., {_venue: true, _customer: true})
 * @returns List of bookings
 */
export async function getBookings(
  params?: TBookingInclude
): Promise<TBooking[]> {
  const { token } = requireAuth()
  const query = toQuery(params)
  return api<TBooking[]>(`/holidaze/bookings${query}`, {
    token,
    useApiKey: true,
  })
}

/** Payload for creating/updating a booking. */
export type BookingUpsertInput = {
  venueId: string
  dateFrom: string // ISO
  dateTo: string // ISO
  guests: number
}

/**
 * Create a booking (customer-only).
 *
 * @param input - Booking payload
 * @returns Created booking
 */
export async function createBooking(
  input: BookingUpsertInput
): Promise<TBooking> {
  const { token } = requireCustomerAuth()
  return api<TBooking>('/holidaze/bookings', {
    method: 'POST',
    token,
    useApiKey: true,
    body: input,
  })
}

/**
 * Update an existing booking (customer-only).
 *
 * @param id - Booking id
 * @param input - Partial payload to update
 * @returns Updated booking
 */
export async function updateBooking(
  id: string,
  input: Partial<BookingUpsertInput>
): Promise<TBooking> {
  const { token } = requireCustomerAuth()
  return api<TBooking>(`/holidaze/bookings/${id}`, {
    method: 'PUT',
    token,
    useApiKey: true,
    body: input,
  })
}

/**
 * Delete a booking (customer-only).
 * NOTE: Not currently surfaced in the UI; kept for future use.
 * @param id - Booking id
 * @returns Resolves when deletion succeeds
 */
export async function deleteBooking(id: string): Promise<void> {
  const { token } = requireCustomerAuth()
  await api<void>(`/holidaze/bookings/${id}`, {
    method: 'DELETE',
    token,
    useApiKey: true,
  })
}
