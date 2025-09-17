// src/services/bookings.ts
import { api } from '@/lib/api'
import { useSession } from '@/store/session'
import type { TBooking, TBookingInclude } from '@/types/api'

/** Build a clean query string from optional include flags. */
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

/** Auth helpers */
function requireAuth() {
  const { token, user } = useSession.getState()
  if (!token) throw new Error('Not authenticated')
  return { token, user }
}

function requireCustomerAuth() {
  const { token, user } = requireAuth()
  if (user?.venueManager) {
    throw new Error('Only customers can perform this action')
  }
  return { token, user }
}

/**
 * Fetch bookings (auth required).
 * Useful for e.g. managers viewing bookings on their venues if your endpoint permits.
 * Add include flags with params (e.g. { _venue: true, _customer: true }).
 */
export async function getBookings(
  params?: TBookingInclude
): Promise<TBooking[]> {
  const { token } = requireAuth()
  const query = toQuery(params)
  // Holidaze base path, consistent with your other services
  return api<TBooking[]>(`/holidaze/bookings${query}`, {
    token,
    useApiKey: true,
  })
}

/** Payload for creating/updating a booking */
export type BookingUpsertInput = {
  venueId: string
  dateFrom: string // ISO
  dateTo: string // ISO
  guests: number
}

/** Create a booking (customer-only) */
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
 * (Only include fields you allow users to change.)
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

/** Delete a booking (customer-only). */
export async function deleteBooking(id: string): Promise<void> {
  const { token } = requireCustomerAuth()
  await api<void>(`/holidaze/bookings/${id}`, {
    method: 'DELETE',
    token,
    useApiKey: true,
  })
}
