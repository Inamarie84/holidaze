import LoginPageClient from './LoginPageClient'

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
