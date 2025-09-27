import type { Metadata } from 'next'
import RegisterPageClient from './RegisterPageClient'

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Register as a Customer or Venue Manager.',
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Record<string, string | undefined>
}

/**
 * Registration page (server entry).
 * Determines initial role from the URL.
 */
export default function RegisterPage({ searchParams }: PageProps) {
  const initialRole = searchParams?.role === 'manager' ? 'manager' : 'customer'
  return <RegisterPageClient initialRole={initialRole} />
}
