import type { Metadata } from 'next'
import ProfilePageClient from './ProfilePageClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your account',
}

/** Profile page shell that renders the client logic. */
export default function Page() {
  return <ProfilePageClient />
}
