// src/components/SessionHydrator.tsx
'use client'

import { useEffect } from 'react'
import { useSession } from '@/store/session'

export default function SessionHydrator() {
  const hydrate = useSession((s) => s.hydrate)
  const logout = useSession((s) => s.logout)

  useEffect(() => {
    hydrate()

    // cross-tab sync (logout/login in another tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'holidaze_session') {
        // just re-hydrate on any change
        hydrate()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [hydrate, logout])

  return null
}
