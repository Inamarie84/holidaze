// src/components/home/search/useSearchQuery.ts
'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReadonlyURLSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

type Guests = number | ''

/**
 * Centralized state + URL-sync for the venues search query.
 * Handles:
 * - initial state from URL
 * - back/forward syncing
 * - debounced destination typing
 * - auto-reset page=1 when any filter is present
 * - clearing invalid "to" when before "from"
 */
export function useSearchQuery(opts: {
  sp: ReadonlyURLSearchParams
  pathname: string
  router: { replace: (url: string) => void; push: (url: string) => void }
}) {
  const { sp, pathname, router } = opts

  const [destination, setDestination] = useState(sp.get('q') ?? '')
  const [from, setFrom] = useState(sp.get('dateFrom') ?? '')
  const [to, setTo] = useState(sp.get('dateTo') ?? '')
  const [guests, setGuests] = useState<Guests>(
    sp.get('guests') ? Number(sp.get('guests')) : ''
  )

  // keep local state in sync when user navigates (back/forward)
  useEffect(() => {
    setDestination(sp.get('q') ?? '')
    setFrom(sp.get('dateFrom') ?? '')
    setTo(sp.get('dateTo') ?? '')
    setGuests(sp.get('guests') ? Number(sp.get('guests')) : '')
  }, [sp])

  // today (yyyy-mm-dd) for nicer UX default min
  const todayYMD = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  // If check-out is earlier than the newly selected check-in, clear it
  useEffect(() => {
    if (from && to && new Date(to) <= new Date(from)) {
      setTo('')
    }
  }, [from, to])

  // Treat /, /venues, and nested /venues/* as “venues index” for live updates
  const onVenuesIndex =
    pathname === '/' ||
    pathname === '/venues' ||
    pathname.startsWith('/venues?') ||
    pathname.startsWith('/venues/')

  function buildQuery(q?: string, f?: string, t?: string, g?: Guests) {
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

  const debouncedDestination = useDebounce(destination, 450)

  // Debounced destination updates (live only on the venues index)
  useEffect(() => {
    if (!onVenuesIndex) return
    const qs = buildQuery(debouncedDestination, from, to, guests)
    router.replace(`/venues${qs}`)
  }, [debouncedDestination, onVenuesIndex, from, to, guests, router])

  // Immediate updates for date/guests
  useEffect(() => {
    if (!onVenuesIndex) return
    const qs = buildQuery(destination, from, to, guests)
    router.replace(`/venues${qs}`)
  }, [destination, from, to, guests, onVenuesIndex, router])

  function submit() {
    const qs = buildQuery(destination, from, to, guests)
    router.push(`/venues${qs}`)
  }

  return {
    destination,
    setDestination,
    from,
    setFrom,
    to,
    setTo,
    guests,
    setGuests,
    todayYMD,
    submit,
  }
}
