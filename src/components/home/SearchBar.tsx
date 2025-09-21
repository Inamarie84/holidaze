'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

export default function SearchBar() {
  const router = useRouter()
  const sp = useSearchParams()
  const pathname = usePathname()

  // initialize from URL
  const [destination, setDestination] = useState(sp.get('q') ?? '')
  const [from, setFrom] = useState(sp.get('dateFrom') ?? '')
  const [to, setTo] = useState(sp.get('dateTo') ?? '')
  const [guests, setGuests] = useState<number | ''>(
    sp.get('guests') ? Number(sp.get('guests')) : ''
  )

  // keep local state in sync when user navigates
  useEffect(() => {
    setDestination(sp.get('q') ?? '')
    setFrom(sp.get('dateFrom') ?? '')
    setTo(sp.get('dateTo') ?? '')
    setGuests(sp.get('guests') ? Number(sp.get('guests')) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp])

  const debouncedDestination = useDebounce(destination, 450)

  // ✅ only treat the *index* as the live-search page (NOT /venues/[id])
  const onVenuesIndex = pathname === '/venues'

  function buildQuery(q?: string, f?: string, t?: string, g?: number | '') {
    const params = new URLSearchParams()
    if (q && q.trim()) params.set('q', q.trim())
    if (f) params.set('dateFrom', f)
    if (t) params.set('dateTo', t)
    if (g) params.set('guests', String(g))

    const hasFilters =
      (q && q.trim().length > 0) ||
      !!f ||
      !!t ||
      (typeof g === 'number' && g > 0)

    if (hasFilters) params.set('page', '1') // reset pagination on new filters
    const qs = params.toString()
    return qs ? `?${qs}` : ''
  }

  // Debounced destination updates (only on /venues)
  useEffect(() => {
    if (!onVenuesIndex) return
    const qs = buildQuery(debouncedDestination, from, to, guests)
    router.replace(`/venues${qs}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDestination])

  // Immediate updates for dates/guests (only on /venues)
  useEffect(() => {
    if (!onVenuesIndex) return
    const qs = buildQuery(destination, from, to, guests)
    router.replace(`/venues${qs}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, guests])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const qs = buildQuery(destination, from, to, guests)
    router.push(`/venues${qs}`) // go to venues (with or without filters)
  }

  return (
    <section className="w-full border-b border-black/10 bg-sand">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <form
          onSubmit={onSubmit}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto_auto] items-end"
          aria-label="Search for a venue"
        >
          {/* Destination */}
          <div className="sm:col-span-2 lg:col-span-1.5">
            <label htmlFor="destination" className="body block mb-1">
              Destination
            </label>
            <input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="City, venue name, seaside…"
              className="w-full rounded-lg border border-black/15 px-3 py-2"
              autoComplete="off"
            />
          </div>

          {/* Check-in */}
          <div>
            <label htmlFor="from" className="body block mb-1">
              Check-in
            </label>
            <input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2"
            />
          </div>

          {/* Check-out */}
          <div>
            <label htmlFor="to" className="body block mb-1">
              Check-out
            </label>
            <input
              id="to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2"
            />
          </div>

          {/* Guests */}
          <div>
            <label htmlFor="guests" className="body block mb-1">
              Guests
            </label>
            <input
              id="guests"
              type="number"
              min={1}
              max={50}
              placeholder="1"
              value={guests}
              onChange={(e) => {
                const v = e.target.value
                setGuests(v === '' ? '' : Math.max(1, Math.min(50, Number(v))))
              }}
              className="w-full rounded-lg border border-black/15 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald/30 transition mt-1"
            aria-label="Search venues"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  )
}
