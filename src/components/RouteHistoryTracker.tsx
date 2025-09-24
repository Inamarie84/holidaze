// src/components/RouteHistoryTracker.tsx
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function RouteHistoryTracker() {
  const pathname = usePathname()
  const search = useSearchParams()

  useEffect(() => {
    const query = search?.toString()
    const current = `${pathname}${query ? `?${query}` : ''}`

    // shift current -> prev, then store new current
    const prev = sessionStorage.getItem('currentPath')
    if (prev) sessionStorage.setItem('prevPath', prev)
    sessionStorage.setItem('currentPath', current)
  }, [pathname, search])

  return null
}
