/**
 * Date & booking helpers (pure and SSR/CSR safe).
 */

/** Parse ISO to timestamp, return 0 if invalid. */
export function ts(iso?: string) {
  if (!iso) return 0
  const n = Date.parse(iso)
  return Number.isNaN(n) ? 0 : n
}

/** Today at midnight (local). */
export function todayMidnight() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** Split bookings into upcoming vs past based on dateTo. */
export function partitionBookings<
  T extends { dateFrom: string; dateTo: string },
>(list: T[]) {
  const today = todayMidnight()
  const past: T[] = []
  const upcoming: T[] = []
  for (const b of list) {
    const end = new Date(b.dateTo)
    ;(end < today ? past : upcoming).push(b)
  }
  upcoming.sort((a, b) => +new Date(a.dateFrom) - +new Date(b.dateFrom))
  past.sort((a, b) => +new Date(b.dateFrom) - +new Date(a.dateFrom))
  return { upcoming, past }
}

/** yyyy-mm-dd | Date -> Date at local midnight (no time). */
export function toDay(dateStr: string | Date) {
  const d = new Date(dateStr)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Overlap helper (treat end as checkout/exclusive). */
export function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
) {
  return !(aEnd <= bStart || aStart >= bEnd)
}

/** Check if a [from,to) range is available vs existing bookings. */
export function isRangeAvailable<
  T extends { dateFrom: string | Date; dateTo: string | Date },
>(bookings: T[] | undefined, from: Date, to: Date) {
  if (!bookings?.length) return true
  return !bookings.some((b) =>
    rangesOverlap(from, to, toDay(b.dateFrom), toDay(b.dateTo))
  )
}
