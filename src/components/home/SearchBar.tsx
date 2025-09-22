// src/components/home/SearchBar.tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { Search, MapPin, Users } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const sp = useSearchParams()
  const pathname = usePathname()

  // Refs so the entire field container can focus the input
  const destRef = useRef<HTMLInputElement>(null)
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)
  const guestsRef = useRef<HTMLInputElement>(null)

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

  // Live-update on / and /venues (if you only want /venues, change this)
  const onVenuesIndex = pathname === '/' || pathname === '/venues'

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
    ref: React.RefObject<HTMLInputElement>,
    openDate?: boolean
  ) {
    const el = ref.current
    if (!el) return
    if (openDate && (el as any).showPicker) {
      ;(el as any).showPicker()
      return
    }
    el.focus()
  }

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
            className="rounded-lg border border-black/15 bg-white p-2 hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald transition cursor-pointer"
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
          <div
            className="
              grid gap-3
              grid-cols-1
              sm:grid-cols-[1fr_1fr_0.6fr_auto]
            "
          >
            {/* Check-in */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => clickToFocus(fromRef, true)}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') &&
                clickToFocus(fromRef, true)
              }
              className="rounded-lg border border-black/15 bg-white p-2 hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald transition cursor-pointer"
            >
              <label htmlFor="from" className="body block mb-1">
                Check-in
              </label>
              <input
                ref={fromRef}
                id="from"
                type="date"
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
              className="rounded-lg border border-black/15 bg-white p-2 hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald transition cursor-pointer"
            >
              <label htmlFor="to" className="body block mb-1">
                Check-out
              </label>
              <input
                ref={toRef}
                id="to"
                type="date"
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
              className="rounded-lg border border-black/15 bg-white p-2 hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald transition cursor-pointer"
            >
              <label htmlFor="guests" className="body block mb-1">
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
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald/30 transition"
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
