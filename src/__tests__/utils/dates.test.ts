// src/__tests__/utils/dates.test.ts
import { partitionBookings } from '@/utils/dates'

function iso(y: number, m: number, d: number) {
  return new Date(Date.UTC(y, m - 1, d)).toISOString()
}

test('partitionBookings splits past vs upcoming', () => {
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 10)

  const past = { dateFrom: iso(2024, 1, 1), dateTo: iso(2024, 1, 3) } as any
  const future = {
    dateFrom: nextMonth.toISOString(),
    dateTo: nextMonth.toISOString(),
  } as any

  const { past: p, upcoming } = partitionBookings([past, future])
  expect(p.length).toBe(1)
  expect(upcoming.length).toBe(1)
})
