// src/components/home/SearchBar.tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { Search, MapPin, Users } from 'lucide-react'

/**
 * SearchBar
 * Builds a query string (q, dateFrom, dateTo, guests) and navigates to /venues.
 * - Debounced destination typing on / and /venues pages
 * - Resets `page=1` whenever filters change
 * - Ensures check-out min = check-in
 */
export default function SearchBar() {
  const router = useRouter()
  const sp = useSearchParams()
  const pathname = usePathname()

  // Refs so the entire field container can focus the input
  const destRef = useRef<HTMLInputElement | null>(null)
  const fromRef = useRef<HTMLInputElement | null>(null)
  const toRef = useRef<HTMLInputElement | null>(null)
  const guestsRef = useRef<HTMLInputElement | null>(null)

  // initialize from URL
  const [destination, setDestination] = useState(sp.get('q') ?? '')
  const [from, setFrom] = useState(sp.get('dateFrom') ?? '')
  const [to, setTo] = useState(sp.get('dateTo') ?? '')
  const [guests, setGuests] = useState<number | ''>(
    sp.get('guests') ? Number(sp.get('guests')) : ''
  )

  // keep local state in sync when user navigates (back/forward)
  useEffect(() => {
    setDestination(sp.get('q') ?? '')
    setFrom(sp.get('dateFrom') ?? '')
    setTo(sp.get('dateTo') ?? '')
    setGuests(sp.get('guests') ? Number(sp.get('guests')) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp])

  const debouncedDestination = useDebounce(destination, 450)

  // Treat /, /venues, and nested /venues/* as “venues index” for live updates
  const onVenuesIndex =
    pathname === '/' ||
    pathname === '/venues' ||
    pathname.startsWith('/venues?') ||
    pathname.startsWith('/venues/')

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

    // Always reset to page 1 when filters change
    if (hasFilters) params.set('page', '1')

    const qs = params.toString()
    return qs ? `?${qs}` : ''
  }

  // Debounced destination updates
  useEffect(() => {
    if (!onVenuesIndex) return
    const qs = buildQuery(debouncedDestination, from, to, guests)
    router.replace(`/venues${qs}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDestination])

  // Immediate updates for dates/guests
  useEffect(() => {
    if (!onVenuesIndex) return
    const qs = buildQuery(destination, from, to, guests)
    router.replace(`/venues${qs}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, guests])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const qs = buildQuery(destination, from, to, guests)
    router.push(`/venues${qs}`)
  }

  // Make the entire box clickable; open native date picker when supported
  function clickToFocus(
    ref: React.RefObject<HTMLInputElement | null>,
    openDate?: boolean
  ) {
    const el = ref.current
    if (!el) return
    if (openDate && typeof (el as any).showPicker === 'function') {
      ;(el as any).showPicker()
      return
    }
    el.focus()
  }

  // today (yyyy-mm-dd) for nicer UX default min
  const todayYMD = (() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${y}-${m}-${day}`
  })()

  // If check-out is earlier than the newly selected check-in, clear it
  useEffect(() => {
    if (from && to && new Date(to) <= new Date(from)) {
      setTo('')
    }
  }, [from, to])

  return (
    <section className="w-full border-b border-black/10 bg-sand">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <form
          onSubmit={onSubmit}
          aria-label="Search for a venue"
          className="space-y-3"
        >
          {/* Line 1: Destination (full width) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => clickToFocus(destRef)}
            onKeyDown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && clickToFocus(destRef)
            }
            className="cursor-pointer rounded-lg border border-black/15 bg-white p-2 transition hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald"
          >
            <label htmlFor="destination" className="body mb-1 block">
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} aria-hidden="true" />
                Destination
              </span>
            </label>
            <input
              ref={destRef}
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="City, venue name, seaside…"
              className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none"
              autoComplete="off"
            />
          </div>

          {/* Line 2: Check-in | Check-out | Guests | Search */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_0.6fr_auto]">
            {/* Check-in */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => clickToFocus(fromRef, true)}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') &&
                clickToFocus(fromRef, true)
              }
              className="cursor-pointer rounded-lg border border-black/15 bg-white p-2 transition hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald"
            >
              <label htmlFor="from" className="body mb-1 block">
                Check-in
              </label>
              <input
                ref={fromRef}
                id="from"
                type="date"
                min={todayYMD}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none"
              />
            </div>

            {/* Check-out */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => clickToFocus(toRef, true)}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') &&
                clickToFocus(toRef, true)
              }
              className="cursor-pointer rounded-lg border border-black/15 bg-white p-2 transition hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald"
            >
              <label htmlFor="to" className="body mb-1 block">
                Check-out
              </label>
              <input
                ref={toRef}
                id="to"
                type="date"
                min={from || todayYMD}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none"
              />
            </div>

            {/* Guests */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => clickToFocus(guestsRef)}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') && clickToFocus(guestsRef)
              }
              className="cursor-pointer rounded-lg border border-black/15 bg-white p-2 transition hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald"
            >
              <label htmlFor="guests" className="body mb-1 block">
                <span className="inline-flex items-center gap-2">
                  <Users size={16} aria-hidden="true" />
                  Guests
                </span>
              </label>
              <input
                ref={guestsRef}
                id="guests"
                type="number"
                min={1}
                max={50}
                placeholder="1"
                value={guests}
                onChange={(e) => {
                  const v = e.target.value
                  setGuests(
                    v === '' ? '' : Math.max(1, Math.min(50, Number(v)))
                  )
                }}
                className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none"
              />
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald px-5 py-2.5 text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-emerald/30"
              aria-label="Search venues"
            >
              <Search size={18} aria-hidden="true" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
