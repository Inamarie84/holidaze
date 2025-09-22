'use client'
import { useSearchParams } from 'next/navigation'

/**
 * Read the desired auth role from the URL (?role=manager|customer).
 * Defaults to "customer".
 */
export function useAuthRole(): 'customer' | 'manager' {
  const sp = useSearchParams()
  return sp.get('role') === 'manager' ? 'manager' : 'customer'
}
