import type { Metadata } from 'next'
import RegisterPageClient from './RegisterPageClient'

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Register as a Customer or Venue Manager.',
  robots: { index: false, follow: false },
}

/**
 * Next 15: `searchParams` is a Promise you should `await`.
 */
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const roleParam =
    typeof sp.role === 'string'
      ? sp.role
      : Array.isArray(sp.role)
        ? sp.role[0]
        : undefined
  const initialRole =
    roleParam === 'manager' ? ('manager' as const) : 'customer'

  return <RegisterPageClient initialRole={initialRole} />
}
