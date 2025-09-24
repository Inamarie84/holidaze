// src/components/auth/AuthGate.tsx
'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useSession } from '@/store/session'

type Props = {
  /** Where to send unauthenticated users. Defaults to /login. */
  redirectTo?: string
  /** Query key used to pass the post-login return URL. Defaults to "redirect". */
  redirectParam?: string
  /** Optional fallback shown while hydrating (e.g., a skeleton). */
  fallback?: React.ReactNode
  children?: React.ReactNode
}

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

  // Recreate the current URL so we can return to it after login
  const currentUrl = useMemo(() => {
    const qs = search?.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }, [pathname, search])

  useEffect(() => {
    if (!hasHydrated) return
    if (token) return

    // Prevent double replace if React re-runs effects
    if (redirectedRef.current) return
    redirectedRef.current = true

    const url = new URL(redirectTo, window.location.origin)
    // Don’t stomp an existing redirect param if one is already present
    if (!url.searchParams.has(redirectParam) && currentUrl) {
      url.searchParams.set(redirectParam, currentUrl)
    }
    router.replace(url.pathname + url.search)
  }, [hasHydrated, token, redirectTo, redirectParam, currentUrl, router])

  // While hydrating, show skeleton (or nothing) to avoid flicker
  if (!hasHydrated) {
    return (
      <>
        {fallback ?? (
          <div className="py-8 text-center text-gray-500">Loading…</div>
        )}
      </>
    )
  }

  // If we’re unauthenticated post-hydration, we’ve already triggered a redirect.
  if (!token) return null

  // Authenticated → render protected content
  return <>{children}</>
}
