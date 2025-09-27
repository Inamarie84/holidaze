'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '@/store/session'
import BookingDates from './BookingDates'
import GuestsField from './BookingGuestsField'
import PriceSummary from './PriceSummary'
import JustBookedPanel from './JustBookedPanel'
import DateError from './DateError'
import { useBookingForm } from './useBookingForm'
import type { TBooking } from '@/types/api'

type Props = {
  venue: {
    id: string
    name: string
    price: number
    maxGuests: number
    bookings?: TBooking[]
  }
}

/**
 * Booking form wrapper that guards actions by role/auth and delegates
 * date/guest logic to `useBookingForm`.
 */
export default function BookingForm({ venue }: Props) {
  const router = useRouter()
  const { token, user } = useSession()
  const isManager = !!user?.venueManager
  const canBook = !!token && !isManager

  const {
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    guests,
    setGuests,
    loading,
    justBooked,
    todayYMD,
    guestError,
    dateError,
    nights,
    total,
    submit,
  } = useBookingForm(
    {
      id: venue.id,
      price: venue.price,
      maxGuests: venue.maxGuests,
      bookings: venue.bookings,
    },
    { token, isManager, onAfterSuccess: () => router.refresh() }
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="mt-2 space-y-3 rounded-xl border border-black/10 bg-white p-4"
      aria-label={`Book ${venue.name}`}
    >
      {!token && (
        <div className="mb-2 flex items-center justify-between gap-3 rounded-lg border border-emerald/30 bg-sand px-3 py-2">
          <p className="body text-sm">Please log in to book this venue.</p>
          <Link
            href="/login?role=customer"
            className="inline-flex items-center rounded-md bg-emerald px-3 py-1.5 text-sm text-white hover:opacity-90 shrink-0 whitespace-nowrap"
          >
            Log in
          </Link>
        </div>
      )}

      {token && isManager && (
        <p className="muted text-sm">
          Managers can’t book venues. Switch to a customer account to book.
        </p>
      )}

      {canBook && (
        <>
          <BookingDates
            dateFrom={dateFrom}
            dateTo={dateTo}
            minDate={todayYMD}
            onFromChange={setDateFrom}
            onToChange={setDateTo}
          />

          <GuestsField
            maxGuests={venue.maxGuests}
            value={guests}
            onChange={setGuests}
            error={guestError}
          />

          <PriceSummary price={venue.price} nights={nights} total={total} />

          <DateError message={dateError} />

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="inline-flex items-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Booking…' : 'Book now'}
          </button>

          {justBooked && <JustBookedPanel />}
        </>
      )}
    </form>
  )
}
