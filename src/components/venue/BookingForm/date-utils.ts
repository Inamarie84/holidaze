import type { TBooking } from '@/types/api'

/** yyyy-mm-dd | Date -> Date at local midnight (no time) */
export function toDay(dateStr: string | Date) {
  const d = new Date(dateStr)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Overlap helper (treat end as checkout/exclusive) */
export function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
) {
  return !(aEnd <= bStart || aStart >= bEnd)
}

/** Check if a [from,to) range is available vs existing bookings */
export function isRangeAvailable(
  bookings: TBooking[] | undefined,
  from: Date,
  to: Date
) {
  if (!bookings?.length) return true
  return !bookings.some((b) =>
    rangesOverlap(from, to, toDay(b.dateFrom), toDay(b.dateTo))
  )
}
