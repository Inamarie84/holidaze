// src/app/profile/page.tsx
'use client'

/**
 * Profile page (protected).
 * - Uses AuthGate to redirect if not logged in
 * - Fetches current profile (token from Zustand)
 * - Fetches bookings (with _venue=true) and manager venues (with _bookings=true)
 * - Renders header, manager-only venues, and user bookings
 */

import { useEffect, useState } from 'react'
import AuthGate from '@/components/auth/AuthGate'
import { getMyProfile } from '@/services/auth'
import { api } from '@/lib/api'
import type { TProfile, TBooking, TVenue } from '@/types/api'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ManagerVenues from '@/components/profile/ManagerVenues'
import MyBookings from '@/components/profile/MyBookings'
import { useSession } from '@/store/session'

export default function ProfilePage() {
  const { user, token } = useSession()
  const [profile, setProfile] = useState<TProfile | null>(null)
  const [bookings, setBookings] = useState<TBooking[]>([])
  const [venues, setVenues] = useState<TVenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        setError(null)

        // 1) Profile
        const p = (await getMyProfile()) as TProfile
        if (!mounted) return
        setProfile(p)

        // Guard: we need a name to fetch /profiles/:name resources
        const name = p.name
        if (!name) return

        // 2) Bookings for this user (include venue objects for nicer cards)
        const b = await api<TBooking[]>(
          `/profiles/${encodeURIComponent(name)}/bookings?_venue=true`,
          { token: token ?? undefined }
        )
        if (!mounted) return
        setBookings(Array.isArray(b) ? b : [])

        // 3) If manager, load their venues (include bookings for badges/availability)
        if (p.venueManager) {
          const v = await api<TVenue[]>(
            `/profiles/${encodeURIComponent(name)}/venues?_bookings=true`,
            { token: token ?? undefined }
          )
          if (!mounted) return
          setVenues(Array.isArray(v) ? v : [])
        } else {
          setVenues([])
        }
      } catch (err: unknown) {
        if (!mounted) return
        const msg =
          err instanceof Error ? err.message : 'Failed to load profile'
        setError(msg)
      } finally {
        mounted && setLoading(false)
      }
    }

    // Only try to load if we *think* we’re logged in
    if (token) {
      load()
    } else {
      // If AuthGate hasn’t redirected yet, show a light state
      setLoading(false)
    }

    return () => {
      mounted = false
    }
  }, [token])

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
                {/* Pass the venues array (not ownerName) */}
                <ManagerVenues venues={venues} />
              </section>
            )}

            <section className="mt-10">
              <h2 className="h2 mb-4">My Bookings</h2>
              {/* Pass bookings array as expected by MyBookings */}
              <MyBookings bookings={bookings} />
            </section>
          </>
        )}

        {/* Optional: empty state if somehow no profile and no loading/error */}
        {!loading && !error && !profile && (
          <p className="body muted">
            You’re not logged in. (If this persists, try refreshing.)
          </p>
        )}
      </main>
    </AuthGate>
  )
}
