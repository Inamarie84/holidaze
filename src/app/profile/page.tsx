// src/app/profile/page.tsx
import type { Metadata } from 'next'
import ProfilePageClient from './ProfilePageClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your account',
}

export default function Page() {
  return <ProfilePageClient />
}
