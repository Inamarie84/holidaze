// src/services/bookings.ts
import { api } from '@/lib/api'

export type Booking = {
  id: string
  dateFrom: string
  dateTo: string
  guests: number
  venueId: string
}

export const getAllBookings = () => api<Booking[]>('/bookings')
export const getBooking = (id: string) => api<Booking>(`/bookings/${id}`)
export const createBooking = (payload: Omit<Booking, 'id'>, token: string) =>
  api<Booking>('/bookings', { method: 'POST', body: payload, token })
