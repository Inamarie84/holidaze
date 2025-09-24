// src/components/SessionHydrator.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useSession, type SessionUser } from '@/store/session'
import { getMyProfile } from '@/services/profiles'

export default function SessionHydrator() {
  const { token, user, hasHydrated, setUser } = useSession()
  const didSyncRef = useRef(false)

  // Ensure the in-memory store is marked hydrated as soon as we’re on the client.
  useEffect(() => {
    if (!hasHydrated) {
      // Flip the flag proactively; persist middleware will also flip it when ready.
      useSession.setState({ hasHydrated: true })
    }
    // intentionally not depending on hasHydrated here — we only want to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // After hydration + when authenticated, optionally sync avatar/role from API once.
  useEffect(() => {
    if (!hasHydrated) return
    if (!token || !user?.name) return
    if (didSyncRef.current) return

    const needsRole = typeof user.venueManager !== 'boolean'
    const needsAvatar = !user.avatar

    if (!needsRole && !needsAvatar) {
      didSyncRef.current = true
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const p = await getMyProfile()
        if (cancelled) return
        const nextUser: SessionUser = {
          name: p.name,
          email: p.email,
          venueManager: p.venueManager,
          avatar: p.avatar
            ? { url: p.avatar.url, alt: p.avatar.alt }
            : undefined,
        }
        setUser(nextUser)
      } finally {
        didSyncRef.current = true
      }
    })()

    return () => {
      cancelled = true
    }
  }, [
    hasHydrated,
    token,
    user?.name,
    user?.venueManager,
    user?.avatar,
    setUser,
  ])

  return null
}
