// src/components/auth/AuthGate.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/store/session'

export default function AuthGate({
  redirectTo = '/',
  children,
}: {
  redirectTo?: string
  children?: React.ReactNode
}) {
  const { token, hasHydrated } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!hasHydrated) return
    if (!token) router.replace(redirectTo)
  }, [hasHydrated, token, redirectTo, router])

  // while hydrating, avoid flicker or premature redirects
  if (!hasHydrated) {
    return <div className="py-8 text-center text-grey">Loading…</div>
  }

  return <>{children}</>
}
