// src/components/SessionHydrator.tsx
'use client'
import { useEffect } from 'react'
import { useSession } from '@/store/session'

export default function SessionHydrator() {
  const hydrate = useSession((s) => s.hydrate)
  useEffect(() => {
    hydrate()
  }, [hydrate])
  return null
}
