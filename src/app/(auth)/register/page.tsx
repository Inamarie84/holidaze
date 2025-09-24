import RegisterPageClient from './RegisterPageClient'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp = await searchParams
  const initialRole = sp?.role === 'manager' ? 'manager' : 'customer'
  return <RegisterPageClient initialRole={initialRole} />
}
