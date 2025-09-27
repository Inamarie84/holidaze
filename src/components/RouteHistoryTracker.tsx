'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Persists simple route history in sessionStorage so you can build a “Smart back”
 * experience elsewhere (reads `prevPath` / `currentPath`).
 *
 * Writes on every navigation:
 *  - prevPath    ← previous currentPath (if any)
 *  - currentPath ← new "pathname?query"
 */
export default function RouteHistoryTracker() {
  const pathname = usePathname()
  const search = useSearchParams()

  useEffect(() => {
    // Guard against SSR / disabled storage
    if (typeof window === 'undefined') return
    try {
      const query = search?.toString()
      const current = `${pathname}${query ? `?${query}` : ''}`

      const prev = sessionStorage.getItem('currentPath')
      if (prev) sessionStorage.setItem('prevPath', prev)
      sessionStorage.setItem('currentPath', current)
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }, [pathname, search])

  return null
}
