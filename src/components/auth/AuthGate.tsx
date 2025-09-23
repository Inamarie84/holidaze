// src/components/auth/AuthGate.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/store/session'

export default function AuthGate({
  redirectTo = '/',
  loading, // 👈 optional custom loading UI
  children,
}: {
  redirectTo?: string
  loading?: React.ReactNode
  children?: React.ReactNode
}) {
  const token = useSession((s) => s.token)
  const hydrated = useSession((s) => s._hasHydrated)
  const router = useRouter()

  useEffect(() => {
    if (!hydrated) return
    if (!token) router.replace(redirectTo)
  }, [hydrated, token, redirectTo, router])

  if (!hydrated) {
    // Default tiny spinner if nothing is passed in
    return (
      <>
        {loading ?? (
          <div className="py-16 flex items-center justify-center">
            <div
              className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-emerald"
              role="status"
              aria-label="Loading"
            />
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}
