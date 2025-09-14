// src/components/auth/AuthGate.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '@/store/session'

export default function AuthGate({
  redirectTo = '/login?role=customer',
  children,
}: {
  redirectTo?: string
  children?: React.ReactNode
}) {
  const { token } = useSession()
  const router = useRouter()
  const sp = useSearchParams()
  const role = sp.get('role') // optional: keep if you want to pass through

  useEffect(() => {
    if (!token) {
      router.replace(redirectTo)
    }
  }, [token, redirectTo, router])

  // Render children; if not authed, the client will redirect immediately
  return <>{children}</>
}
