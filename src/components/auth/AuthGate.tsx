'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useSession } from '@/store/session'

type Props = {
  /** Where to send unauthenticated users. Defaults to "/login". */
  redirectTo?: string
  /** Query key that carries the return URL. Defaults to "redirect". */
  redirectParam?: string
  /** Optional fallback (e.g. skeleton) during hydration. */
  fallback?: React.ReactNode
  children?: React.ReactNode
}

/**
 * Client-only guard for protected pages. While hydrating it shows a fallback.
 * After hydration, if there is no token, it redirects to `redirectTo`
 * and passes the current URL in `redirectParam`.
 */
export default function AuthGate({
  redirectTo = '/login',
  redirectParam = 'redirect',
  fallback,
  children,
}: Props) {
  const { token, hasHydrated } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const redirectedRef = useRef(false)

  // Compose current URL to return to after login
  const currentUrl = useMemo(() => {
    const qs = search?.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }, [pathname, search])

  useEffect(() => {
    if (!hasHydrated) return
    if (token) return
    if (redirectedRef.current) return
    redirectedRef.current = true

    const url = new URL(redirectTo, window.location.origin)
    if (!url.searchParams.has(redirectParam) && currentUrl) {
      url.searchParams.set(redirectParam, currentUrl)
    }
    router.replace(url.pathname + url.search)
  }, [hasHydrated, token, redirectTo, redirectParam, currentUrl, router])

  // While hydrating, show fallback to avoid flicker / mismatches
  if (!hasHydrated) {
    return (
      <>
        {fallback ?? (
          <div className="py-8 text-center text-gray-500">Loading…</div>
        )}
      </>
    )
  }

  // If unauthenticated post-hydration, the redirect is already in-flight
  if (!token) return null

  // Authenticated
  return <>{children}</>
}
