'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createBooking } from '@/services/bookings'
import { useSession } from '@/store/session'
import type { TBooking } from '@/types/api'
import { errMsg } from '@/utils/errors'
import FormError from '@/components/ui/FormError'

type Props = {
  venue: {
    id: string
    name: string
    price: number
    maxGuests: number
    bookings?: TBooking[]
  }
}

/** Truncate a date to midnight (local). */
function toDay(dateStr: string | Date) {
  const d = new Date(dateStr)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  // Treat end as checkout (exclusive)
  return !(aEnd <= bStart || aStart >= bEnd)
}

function isRangeAvailable(
  bookings: TBooking[] | undefined,
  from: Date,
  to: Date
) {
  if (!bookings?.length) return true
  return !bookings.some((b) =>
    rangesOverlap(from, to, toDay(b.dateFrom), toDay(b.dateTo))
  )
}

export default function BookingForm({ venue }: Props) {
  const router = useRouter()
  const { token, user } = useSession()

  // prevent managers from booking
  const isManager = !!user?.venueManager
  const canBook = !!token && !isManager

  const todayYMD = useMemo(() => {
    const t = new Date()
    const y = t.getFullYear()
    const m = String(t.getMonth() + 1).padStart(2, '0')
    const d = String(t.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }, [])

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!token) {
      toast.error('Please log in to book.')
      const back =
        typeof window !== 'undefined' ? window.location.pathname : '/'
      router.push(`/login?redirect=${encodeURIComponent(back)}`)
      return
    }
    if (isManager) {
      toast.error('Managers can’t book venues.')
      return
    }
    if (guestError || dateError) {
      toast.error(guestError ?? dateError ?? 'Please fix the errors.')
      return
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
      router.refresh()
    } catch (err) {
      toast.error(errMsg(err))
    } finally {
      setLoading(false)
    }
  }

  const nights = useMemo(() => {
    if (!dateFrom || !dateTo) return 0
    const from = new Date(dateFrom)
    const to = new Date(dateTo)
    const ms = to.getTime() - from.getTime()
    return ms > 0 ? Math.floor(ms / (1000 * 60 * 60 * 24)) : 0
  }, [dateFrom, dateTo])

  const total = nights * (venue.price ?? 0)

  return (
    <form
      onSubmit={onSubmit}
      className="mt-2 space-y-3 rounded-xl border border-black/10 bg-white p-4"
      aria-label={`Book ${venue.name}`}
    >
      {!token && (
        <div className="mb-2 flex items-center justify-between gap-3 rounded-lg border border-emerald/30 bg-sand px-3 py-2">
          <p className="body text-sm">Please log in to book this venue.</p>
          <button
            type="button"
            onClick={() => router.push('/login?role=customer')}
            className="inline-flex items-center rounded-md bg-emerald px-3 py-1.5 text-white hover:opacity-90"
          >
            Log in
          </button>
        </div>
      )}

      {token && isManager && (
        <p className="muted text-sm">
          Managers can’t book venues. Switch to a customer account to book.
        </p>
      )}

      {canBook && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="body mb-1 block" htmlFor="check-in">
                Check-in
              </label>
              <input
                id="check-in"
                type="date"
                min={todayYMD}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-black/15 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="body mb-1 block" htmlFor="check-out">
                Check-out
              </label>
              <input
                id="check-out"
                type="date"
                min={dateFrom || todayYMD}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-black/15 px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="body mb-1 block" htmlFor="guests">
              Guests (max {venue.maxGuests})
            </label>
            <input
              id="guests"
              type="number"
              min={1}
              max={venue.maxGuests}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full rounded-lg border border-black/15 px-3 py-2"
              required
            />
            <FormError message={guestError} />
          </div>

          <div className="rounded-lg border border-black/10 bg-white/60 px-3 py-2">
            <div className="text-sm">
              {venue.price} NOK / night
              {nights > 0 && (
                <span className="ml-2 opacity-80">
                  × {nights} = <b>{total} NOK</b>
                </span>
              )}
            </div>
          </div>

          {dateError && <FormError message={dateError} />}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="inline-flex items-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Booking…' : 'Book now'}
          </button>
        </>
      )}
    </form>
  )
}
