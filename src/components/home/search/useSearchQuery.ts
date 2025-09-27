'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReadonlyURLSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

type Guests = number | ''

type RouterShape = {
  replace: (url: string) => void
  push: (url: string) => void
}

type Opts = {
  sp: ReadonlyURLSearchParams
  pathname: string
  router: RouterShape
}

/**
 * Centralized state + URL-sync for the venues search query.
 *
 * Responsibilities:
 * - init state from URL (q, dateFrom, dateTo, guests)
 * - keep state in sync when user navigates back/forward
 * - debounce destination typing for live list updates
 * - maintain `page=1` when any filter is applied
 * - clear invalid "to" when earlier than "from"
 */
export function useSearchQuery({ sp, pathname, router }: Opts) {
  const [destination, setDestination] = useState(sp.get('q') ?? '')
  const [from, setFrom] = useState(sp.get('dateFrom') ?? '')
  const [to, setTo] = useState(sp.get('dateTo') ?? '')
  const [guests, setGuests] = useState<Guests>(
    sp.get('guests') ? Number(sp.get('guests')) : ''
  )

  // Sync when URL changes (back/forward)
  useEffect(() => {
    setDestination(sp.get('q') ?? '')
    setFrom(sp.get('dateFrom') ?? '')
    setTo(sp.get('dateTo') ?? '')
    setGuests(sp.get('guests') ? Number(sp.get('guests')) : '')
  }, [sp])

  // today (yyyy-mm-dd) for min constraints
  const todayYMD = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  // Clear invalid checkout when earlier than checkin
  useEffect(() => {
    if (from && to && new Date(to) <= new Date(from)) {
      setTo('')
    }
  }, [from, to])

  // Live update only on venues index (/, /venues, /venues/*)
  const onVenuesIndex =
    pathname === '/' ||
    pathname === '/venues' ||
    pathname.startsWith('/venues/')

  const buildQuery = (q?: string, f?: string, t?: string, g?: Guests) => {
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

    if (hasFilters) params.set('page', '1')

    const qs = params.toString()
    return qs ? `?${qs}` : ''
  }

  const debouncedDestination = useDebounce(destination, 450)

  // Debounced destination updates (live)
  useEffect(() => {
    if (!onVenuesIndex) return
    const qs = buildQuery(debouncedDestination, from, to, guests)
    router.replace(`/venues${qs}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDestination, onVenuesIndex, from, to, guests])

  // Immediate updates for date/guests (live)
  useEffect(() => {
    if (!onVenuesIndex) return
    const qs = buildQuery(destination, from, to, guests)
    router.replace(`/venues${qs}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, from, to, guests, onVenuesIndex])

  // Explicit submit (always navigates)
  const submit = () => {
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
