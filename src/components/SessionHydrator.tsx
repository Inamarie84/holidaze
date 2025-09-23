// src/components/auth/SessionHydrator.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useSession } from '@/store/session'
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
        setUser({
          name: p.name,
          email: p.email,
          venueManager: p.venueManager,
          avatar: p.avatar,
        } as any)
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
