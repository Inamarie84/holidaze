'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
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

function toDay(dateStr: string | Date) {
  const d = new Date(dateStr)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
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
  const { token } = useSession()

  const todayYMD = useMemo(() => {
    const t = new Date()
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(
      t.getDate()
    ).padStart(2, '0')}`
  }, [])

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)

  const guestError =
    guests < 1
      ? 'Guests must be at least 1'
      : guests > venue.maxGuests
        ? `Max ${venue.maxGuests} guests`
        : null

  const dateError = (() => {
    if (!dateFrom || !dateTo) return null
    const from = new Date(dateFrom)
    const to = new Date(dateTo)
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()))
      return 'Invalid dates'
    if (to <= from) return 'Check-out must be after check-in'
    if (!isRangeAvailable(venue.bookings, toDay(from), toDay(to))) {
      return 'Those dates are already booked'
    }
    return null
  })()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) {
      toast.error('Please log in to book')
      const back =
        typeof window !== 'undefined' ? window.location.pathname : '/'
      router.push(`/login?redirect=${encodeURIComponent(back)}`)
      return
    }
    if (guestError || dateError) {
      toast.error(guestError ?? dateError ?? 'Please fix the errors')
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
      toast.error(errMsg(err)) // ✅ unified errors (401, 422, etc.)
    } finally {
      setLoading(false)
    }
  }

  const nights = (() => {
    if (!dateFrom || !dateTo) return 0
    const from = new Date(dateFrom)
    const to = new Date(dateTo)
    const ms = to.getTime() - from.getTime()
    return ms > 0 ? Math.floor(ms / (1000 * 60 * 60 * 24)) : 0
  })()
  const total = nights * (venue.price ?? 0)

  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 grid gap-4 rounded-xl border border-black/10 p-4 md:grid-cols-5"
      aria-label={`Book ${venue.name}`}
    >
      <div className="grid gap-1 md:col-span-1">
        <label className="text-sm font-medium" htmlFor="guests">
          Guests (max {venue.maxGuests})
        </label>
        <input
          id="guests"
          type="number"
          min={1}
          max={venue.maxGuests}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald"
          required
        />
        <FormError message={guestError} />
      </div>

      <div className="grid gap-1 md:col-span-1">
        <label className="text-sm font-medium" htmlFor="check-out">
          Check-out
        </label>
        <input
          id="check-out"
          type="date"
          min={dateFrom || todayYMD}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald"
          required
        />
      </div>

      <div className="grid gap-1 md:col-span-1">
        <label className="text-sm font-medium" htmlFor="guests">
          Guests (max {venue.maxGuests})
        </label>
        <input
          id="guests"
          type="number"
          min={1}
          max={venue.maxGuests}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald"
          required
        />
        {guestError && <p className="text-sm text-red-600">{guestError}</p>}
      </div>

      <div className="grid gap-1 md:col-span-1">
        <span className="text-sm font-medium">Price</span>
        <div className="rounded-lg border border-black/10 px-3 py-2 bg-white/60">
          <div className="text-sm">
            {venue.price} NOK / night
            {nights > 0 && (
              <span className="ml-2 opacity-80">
                × {nights} = <b>{total} NOK</b>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-end md:col-span-1">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald px-4 py-3 font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Booking…' : 'Book now'}
        </button>
      </div>

      {dateError && (
        <div className="md:col-span-5">
          <FormError message={dateError} className="-mt-2" />
        </div>
      )}
    </form>
  )
}
