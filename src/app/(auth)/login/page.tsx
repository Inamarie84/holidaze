// src/app/(auth)/login/page.tsx
import type { Metadata } from 'next'
import LoginPageClient from './LoginPageClient'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Access your Holidaze account.',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp = await searchParams
  const role = sp?.role
  const redirect =
    typeof sp?.redirect === 'string' && sp.redirect ? sp.redirect : '/profile'

  return <LoginPageClient role={role} redirect={redirect} />
}
