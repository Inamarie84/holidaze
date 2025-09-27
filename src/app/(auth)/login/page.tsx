import type { Metadata } from 'next'
import LoginPageClient from './LoginPageClient'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Access your Holidaze account.',
  robots: { index: false, follow: false },
}

/**
 * Next 15: `searchParams` is a Promise you should `await`.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const role =
    typeof sp.role === 'string'
      ? sp.role
      : Array.isArray(sp.role)
        ? sp.role[0]
        : undefined
  const redirectRaw =
    typeof sp.redirect === 'string'
      ? sp.redirect
      : Array.isArray(sp.redirect)
        ? sp.redirect[0]
        : undefined
  const redirect = redirectRaw && redirectRaw.trim() ? redirectRaw : '/profile'

  return <LoginPageClient role={role} redirect={redirect} />
}
