'use client'

/**
 * Profile page (protected).
 * - Uses AuthGate to redirect if not logged in
 * - Fetches the current profile with the token from Zustand
 * - Renders header, manager-only venues, and user bookings
 */

import { useEffect, useState } from 'react'
import AuthGate from '@/components/auth/AuthGate'
import { getMyProfile } from '@/services/auth'
import type { TProfile } from '@/types/api'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ManagerVenues from '@/components/profile/ManagerVenues'
import MyBookings from '@/components/profile/MyBookings'

export default function ProfilePage() {
  const [profile, setProfile] = useState<TProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const p = await getMyProfile()
        if (mounted) {
          setProfile(p as TProfile)
          setError(null)
        }
      } catch (err: unknown) {
        if (mounted) {
          const msg =
            err instanceof Error ? err.message : 'Failed to load profile'
          setError(msg)
        }
      } finally {
        mounted && setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <AuthGate>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {loading && <p className="body muted">Loading your profile…</p>}
        {error && !loading && <p className="body text-red-600">{error}</p>}

        {profile && (
          <>
            <ProfileHeader profile={profile} />

            {profile.venueManager && (
              <section className="mt-10">
                <h2 className="h2 mb-4">My Venues</h2>
                {/* List venues owned by this manager */}
                <ManagerVenues ownerName={profile.name} />
              </section>
            )}

            <section className="mt-10">
              <h2 className="h2 mb-4">My Bookings</h2>
              {/* List bookings for this customer */}
              <MyBookings customerName={profile.name} />
            </section>
          </>
        )}
      </main>
    </AuthGate>
  )
}
