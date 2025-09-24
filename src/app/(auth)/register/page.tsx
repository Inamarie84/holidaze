// src/app/(auth)/register/page.tsx
import type { Metadata } from 'next'
import RegisterPageClient from './RegisterPageClient'

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Register as a Customer or Venue Manager.',
  robots: { index: false, follow: false }, // optional: noindex
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp = await searchParams
  const initialRole = sp?.role === 'manager' ? 'manager' : 'customer'
  return <RegisterPageClient initialRole={initialRole} />
}
