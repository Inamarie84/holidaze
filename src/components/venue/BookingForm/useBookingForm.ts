'use client'

import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { createBooking } from '@/services/bookings'
import { errMsg } from '@/utils/errors'
import { toDay, isRangeAvailable } from '@/utils/dates'

type VenueCtx = {
  id: string
  price: number
  maxGuests: number
  bookings?: Array<{ dateFrom: string | Date; dateTo: string | Date }>
}

type ExternalCtx = {
  token: string | null
  isManager: boolean
  /** Optional hook (e.g., router.refresh) after success */
  onAfterSuccess?: () => void
}

/**
 * All state/derived values for the BookingForm plus a `submit()` action.
 * Handles auth/role guards, date validation, overlap checks, and success reset.
 */
export function useBookingForm(venue: VenueCtx, ext: ExternalCtx) {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const [justBooked, setJustBooked] = useState(false)

  const todayYMD = useMemo(() => {
    const t = new Date()
    const y = t.getFullYear()
    const m = String(t.getMonth() + 1).padStart(2, '0')
    const d = String(t.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }, [])

  const guestError =
    guests < 1
      ? 'Guests must be at least 1.'
      : guests > venue.maxGuests
        ? `Max ${venue.maxGuests} guests.`
        : null

  const dateError = (() => {
    if (!dateFrom || !dateTo) return null
    const from = new Date(dateFrom)
    const to = new Date(dateTo)
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()))
      return 'Invalid dates.'
    if (to <= from) return 'Check-out must be after check-in.'
    if (!isRangeAvailable(venue.bookings, toDay(from), toDay(to))) {
      return 'Selected dates overlap an existing booking.'
    }
    return null
  })()

  const nights = useMemo(() => {
    if (!dateFrom || !dateTo) return 0
    const from = new Date(dateFrom)
    const to = new Date(dateTo)
    const ms = to.getTime() - from.getTime()
    return ms > 0 ? Math.floor(ms / (1000 * 60 * 60 * 24)) : 0
  }, [dateFrom, dateTo])

  const total = nights * (venue.price ?? 0)

  async function submit(): Promise<boolean> {
    if (!ext.token) {
      toast.error('Please log in to book.')
      return false
    }
    if (ext.isManager) {
      toast.error('Managers can’t book venues.')
      return false
    }
    if (guestError || dateError) {
      toast.error(guestError ?? dateError ?? 'Please fix the errors.')
      return false
    }

    try {
      setLoading(true)
      await createBooking({
        dateFrom: new Date(dateFrom).toISOString(),
        dateTo: new Date(dateTo).toISOString(),
        guests,
        venueId: venue.id,
      })
      toast.success('Booking confirmed 🎉')
      setDateFrom('')
      setDateTo('')
      setGuests(1)
      setJustBooked(true)
      ext.onAfterSuccess?.()
      return true
    } catch (err) {
      toast.error(errMsg(err))
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    // state
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    guests,
    setGuests,
    loading,
    justBooked,
    setJustBooked,
    todayYMD,
    // derived
    guestError,
    dateError,
    nights,
    total,
    // actions
    submit,
  }
}
