'use client'

import { useEffect, useRef } from 'react'
import { useSession, type SessionUser } from '@/store/session'
import { getMyProfile } from '@/services/profiles'

/**
 * Marks the session store as hydrated ASAP on the client,
 * then (once) syncs missing fields (avatar/role) from the API
 * after the user is authenticated.
 */
export default function SessionHydrator() {
  const { token, user, hasHydrated, setUser } = useSession()
  const didSyncRef = useRef(false)

  // Flip hasHydrated promptly on the client to reduce UI flicker.
  useEffect(() => {
    if (!hasHydrated) {
      useSession.setState({ hasHydrated: true })
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // After hydration, if logged in and some fields are missing, sync them.
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
