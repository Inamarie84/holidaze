// src/app/api/venues/search/route.ts
import { NextResponse } from 'next/server'
import { ENV } from '@/lib/env'
import type { TVenueWithBookings, TListResponse } from '@/types/api'

/** yyyy-mm-dd -> Date at local midnight */
function toDay(dateStr: string | Date) {
  const d = new Date(dateStr)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  // treat end as checkout (exclusive)
  return !(aEnd <= bStart || aStart >= bEnd)
}

/**
 * GET /api/venues/search
 * Query params: q, dateFrom, dateTo, guests, page=1, limit=12
 * Returns { data, meta } shaped like Noroff's list response.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const q = (searchParams.get('q') || '').trim()
  const dateFrom = searchParams.get('dateFrom') || ''
  const dateTo = searchParams.get('dateTo') || ''
  const guests = Number(searchParams.get('guests') || '') || undefined

  const page = Math.max(1, Number(searchParams.get('page') || '1'))
  const limit = Math.max(
    1,
    Math.min(100, Number(searchParams.get('limit') || '12'))
  )

  // Use Noroff's search endpoint when q is present; otherwise list recent venues.
  const upstreamPath = q
    ? `/holidaze/venues/search?q=${encodeURIComponent(q)}&_bookings=true&limit=100`
    : `/holidaze/venues?_bookings=true&sort=created&sortOrder=desc&limit=100`

  const res = await fetch(`${ENV.API_URL}${upstreamPath}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': process.env.NEXT_PUBLIC_API_KEY ?? '',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json(
      { error: text || 'Upstream fetch failed' },
      { status: res.status }
    )
  }

  // IMPORTANT: this keeps { data, meta } intact
  const upstream = (await res.json()) as TListResponse<TVenueWithBookings>
  const venues = upstream.data ?? []

  const from = dateFrom ? toDay(dateFrom) : null
  const to = dateTo ? toDay(dateTo) : null

  // Local filters for availability & guests
  const filtered = venues.filter((v) => {
    if (guests && v.maxGuests < guests) return false
    if (from && to) {
      const hasOverlap = (v.bookings ?? []).some((b) =>
        rangesOverlap(from, to, toDay(b.dateFrom), toDay(b.dateTo))
      )
      if (hasOverlap) return false
    }
    return true
  })

  const totalCount = filtered.length
  const pageCount = Math.max(1, Math.ceil(totalCount / limit))
  const start = (page - 1) * limit
  const data = filtered.slice(start, start + limit)

  return NextResponse.json({
    data,
    meta: {
      isFirstPage: page <= 1,
      isLastPage: page >= pageCount,
      currentPage: page,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < pageCount ? page + 1 : null,
      pageCount,
      totalCount,
    },
  })
}
