'use client'

import { useEffect, useRef } from 'react'
import { useSession, type SessionUser } from '@/store/session'
import { getMyProfile } from '@/services/auth'

export default function SessionHydrator() {
  const { token, user, hasHydrated, setUser } = useSession()
  const didSyncRef = useRef(false)

  useEffect(() => {
    if (!hasHydrated) return
    if (!token || !user?.name) return
    if (didSyncRef.current) return

    const missingRole = typeof user.venueManager !== 'boolean'
    const missingAvatar = !user.avatar
    if (!missingRole && !missingAvatar) return
    ;(async () => {
      try {
        const p = await getMyProfile()
        const nextUser: SessionUser = {
          name: p.name,
          email: p.email,
          venueManager: p.venueManager,
          avatar: p.avatar
            ? { url: p.avatar.url, alt: p.avatar.alt }
            : undefined,
        }
        setUser(nextUser) // ✅ no `any`
      } finally {
        didSyncRef.current = true
      }
    })()
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
