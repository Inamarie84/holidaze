import { api } from '@/lib/api'
import type {
  TBooking,
  TBookingInclude,
  TCreateBookingInput,
  TUpdateBookingInput,
  TListResponse,
  TItemResponse,
} from '@/types/api'

/**
 * Fetch all bookings (requires authentication).
 *
 * @param {string} token - The access token for the current user.
 * @param {TBookingInclude} [params] - Optional query flags like `_venue`, `_customer`.
 * @returns {Promise<TBooking[]>} Resolves with an array of bookings.
 *
 * @example
 * const bookings = await getBookings(userToken, { _venue: true })
 */
export async function getBookings(
  token: string,
  params?: TBookingInclude
): Promise<TBooking[]> {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : ''
  return api<TListResponse<TBooking>>(`/bookings${query}`, { token }).then(
    (res) => res.data
  )
}

/**
 * Create a new booking (requires authentication).
 *
 * @param {string} token - The access token for the current user.
 * @param {TCreateBookingInput} payload - The booking data to send.
 * @returns {Promise<TBooking>} Resolves with the created booking object.
 *
 * @example
 * await createBooking(userToken, {
 *   venueId: 'abc123',
 *   dateFrom: new Date().toISOString(),
 *   dateTo: new Date().toISOString(),
 *   guests: 2
 * })
 */
export async function createBooking(
  input: TCreateBookingInput,
  token: string
): Promise<TBooking> {
  const res = await api<TItemResponse<TBooking>>('/bookings', {
    method: 'POST',
    body: input,
    token,
  })
  return res.data
}

/**
 * Update an existing booking (requires authentication).
 *
 * @param {string} token - The access token for the current user.
 * @param {string} id - The booking ID to update.
 * @param {TUpdateBookingInput} payload - The updated fields.
 * @returns {Promise<TBooking>} Resolves with the updated booking object.
 */
export async function updateBooking(
  token: string,
  id: string,
  payload: TUpdateBookingInput
): Promise<TBooking> {
  return api<TItemResponse<TBooking>>(`/bookings/${id}`, {
    method: 'PUT',
    token,
    body: payload,
  }).then((res) => res.data)
}

/**
 * Delete a booking (requires authentication).
 *
 * @param {string} token - The access token for the current user.
 * @param {string} id - The booking ID to delete.
 * @returns {Promise<void>} Resolves with nothing on success.
 */
export async function deleteBooking(token: string, id: string): Promise<void> {
  await api(`/bookings/${id}`, { method: 'DELETE', token })
}
