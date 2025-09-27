'use client'

import { useMemo, useState } from 'react'
import type { TBooking } from '@/types/api'

type Props = {
  /** Bookings fetched with `_bookings=true` on the venue endpoint */
  bookings: TBooking[]
  /** Optional: start the calendar on a specific month */
  initialMonth?: Date
  /** Grey out days before today (local). Default: true */
  disablePast?: boolean
}

/** Normalize to local midnight (prevents off-by-one issues). */
function toDay(dateStr: string) {
  const d = new Date(dateStr)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** yyyy-mm-dd */
function ymd(d: Date) {
  return d.toISOString().slice(0, 10)
}

/** Expand bookings into a Set of yyyy-mm-dd for [dateFrom, dateTo) */
function buildBookedSet(bookings: TBooking[]) {
  const set = new Set<string>()
  for (const b of bookings) {
    const start = toDay(b.dateFrom)
    const end = toDay(b.dateTo) // checkout (exclusive)
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      set.add(ymd(d))
    }
  }
  return set
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/**
 * AvailabilityCalendar
 * Non-interactive month view highlighting booked & past days.
 */
export default function AvailabilityCalendar({
  bookings,
  initialMonth,
  disablePast = true,
}: Props) {
  const [month, setMonth] = useState<Date>(() => {
    const base = initialMonth ? new Date(initialMonth) : new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const booked = useMemo(() => buildBookedSet(bookings), [bookings])

  const year = month.getFullYear()
  const mIdx = month.getMonth()
  const firstOfMonth = new Date(year, mIdx, 1)

  // JS getDay(): 0=Sun..6=Sat → shift so Monday=0..Sunday=6
  const startWeekdaySun0 = firstOfMonth.getDay()
  const startWeekdayMon0 = (startWeekdaySun0 + 6) % 7

  const daysInMonth = new Date(year, mIdx + 1, 0).getDate()

  // Today at local midnight for accurate comparisons
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayId = ymd(today)

  const cells: Array<{
    key: string
    label?: number
    inMonth: boolean
    booked?: boolean
    isToday?: boolean
    isPast?: boolean
  }> = []

  // Leading blanks (for Monday-first grid)
  for (let i = 0; i < startWeekdayMon0; i++) {
    cells.push({ key: `b-${i}`, inMonth: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cur = new Date(year, mIdx, d)
    cur.setHours(0, 0, 0, 0)
    const id = ymd(cur)
    const bookedFlag = booked.has(id)
    const pastFlag = disablePast && cur < today

    cells.push({
      key: id,
      label: d,
      inMonth: true,
      booked: bookedFlag,
      isToday: id === todayId,
      isPast: pastFlag,
    })
  }

  // Trailing blanks to complete the last row
  while (cells.length % 7 !== 0) {
    cells.push({ key: `t-${cells.length}`, inMonth: false })
  }

  const monthName = month.toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="w-full rounded-xl border border-black/10 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth(new Date(year, mIdx - 1, 1))}
          className="rounded-lg border border-black/15 px-3 py-1.5 hover:bg-sand cursor-pointer"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="h3" aria-live="polite">
          {monthName}
        </div>
        <button
          type="button"
          onClick={() => setMonth(new Date(year, mIdx + 1, 1))}
          className="rounded-lg border border-black/15 px-3 py-1.5 hover:bg-sand cursor-pointer"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Weekdays (Mon–Sun) */}
      <div className="mb-2 grid grid-cols-7 gap-2 text-center text-sm text-grey">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((c) =>
          c.inMonth ? (
            <div
              key={c.key}
              className={[
                'aspect-square select-none rounded-lg border text-center leading-[2.25rem] sm:leading-[2.5rem]',
                c.booked
                  ? 'bg-[#e07a5f] text-white border-transparent'
                  : 'border-black/15',
                c.isPast && !c.booked ? 'opacity-40' : '',
                c.isToday && !c.booked && !c.isPast
                  ? 'ring-2 ring-emerald'
                  : '',
              ].join(' ')}
              aria-label={`${c.label} ${
                c.booked ? '(booked)' : c.isPast ? '(past)' : '(available)'
              }`}
              title={c.booked ? 'Booked' : c.isPast ? 'Past' : 'Available'}
            >
              {c.label}
            </div>
          ) : (
            <div key={c.key} />
          )
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded bg-[#e07a5f]" />
          <span className="text-grey">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded border border-black/15" />
          <span className="text-grey">Available</span>
        </div>
        {disablePast && (
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded bg-black/10" />
            <span className="text-grey">Past</span>
          </div>
        )}
      </div>
    </div>
  )
}
