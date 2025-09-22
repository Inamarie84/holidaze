'use client'

import { useEffect, useRef } from 'react'
import { useSession } from '@/store/session'
import { getMyProfile } from '@/services/auth'

/**
 * Reconciles the hydrated session with the latest profile data.
 * - If token exists but session is missing venueManager or avatar,
 *   fetch profile and update store.
 * - Runs once per load (or when name/token changes).
 */
export default function SessionHydrator() {
  const { token, user, setUser } = useSession()
  const didSyncRef = useRef(false)

  useEffect(() => {
    if (!token || !user?.name) return
    if (didSyncRef.current) return

    const missingRole = typeof user.venueManager !== 'boolean'
    const missingAvatar = !user.avatar // optional: keep avatar fresh too

    if (!missingRole && !missingAvatar) return
    ;(async () => {
      try {
        const p = await getMyProfile()
        setUser({
          name: p.name,
          email: p.email,
          venueManager: p.venueManager,
          avatar: p.avatar,
        } as any)
      } catch {
        // silent: not critical to block the app
      } finally {
        didSyncRef.current = true
      }
    })()
  }, [token, user?.name, user?.venueManager, user?.avatar, setUser])

  return null
}
