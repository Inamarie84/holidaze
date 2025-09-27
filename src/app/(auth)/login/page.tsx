import type { Metadata } from 'next'
import LoginPageClient from './LoginPageClient'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Access your Holidaze account.',
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Record<string, string | undefined>
}

/**
 * Login page (server entry).
 * Reads `role` and `redirect` from the URL and passes to the client form.
 */
export default function LoginPage({ searchParams }: PageProps) {
  const role = searchParams?.role
  const redirect =
    typeof searchParams?.redirect === 'string' && searchParams.redirect
      ? searchParams.redirect
      : '/profile'

  return <LoginPageClient role={role} redirect={redirect} />
}
