// src/app/profile/page.tsx
import { redirect } from 'next/navigation'
import { useSession } from '@/store/session'
import { getMyProfile, getMyBookings, getMyVenues } from '@/services/profiles'
import ProfileHeader from '@/components/profile/ProfileHeader'
import MyBookings from '@/components/profile/MyBookings'
import ManagerVenues from '@/components/profile/ManagerVenues'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  // This runs on the server — we can't call useSession() here.
  // Quick guard: if no client session, send users to /login.
  // We detect on the client by rendering a client component gate, or:
  // Easiest: show the page and let actions fail if not logged in.
  // If you *want* a hard redirect, add a small client gate component.
  // For now, we’ll try/catch service calls.

  try {
    const [profile, bookings, venues] = await Promise.all([
      getMyProfile(),
      getMyBookings(),
      getMyVenues().catch(() => []), // non-managers may 403; treat as empty
    ])

    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <ProfileHeader profile={profile} />

        <section className="mt-10">
          <h2 className="h2 mb-3">My bookings</h2>
          <MyBookings bookings={bookings} />
        </section>

        {profile.venueManager && (
          <section className="mt-10">
            <ManagerVenues venues={venues} />
          </section>
        )}
      </main>
    )
  } catch {
    // No session / token error
    redirect('/login?role=customer')
  }
}
