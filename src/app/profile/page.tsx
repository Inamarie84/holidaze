// src/app/profile/page.tsx
'use client'

/**
 * Profile page (protected).
 * - Redirects if not logged in via AuthGate
 * - Fetches current profile (token from Zustand) via getMyProfile()
 * - Fetches bookings (with _venue=true) and manager venues (with _bookings=true)
 * - Filters bookings to upcoming and sorts ascending
 * - Renders role-specific actions, manager venues, and upcoming bookings
 */

import { useEffect, useMemo, useState } from 'react'
import AuthGate from '@/components/auth/AuthGate'
import { getMyProfile } from '@/services/auth'
import { api } from '@/lib/api'
import type { TProfile, TBooking, TVenue } from '@/types/api'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ManagerVenues from '@/components/profile/ManagerVenues'
import MyBookings from '@/components/profile/MyBookings'
import { useSession } from '@/store/session'
import ProfileActions from '@/components/profile/ProfileActions'
import AvatarEditorModal from '@/components/profile/AvatarEditorModal'

export default function ProfilePage() {
  const { token } = useSession()
  const [profile, setProfile] = useState<TProfile | null>(null)
  const [bookings, setBookings] = useState<TBooking[]>([])
  const [venues, setVenues] = useState<TVenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [avatarOpen, setAvatarOpen] = useState(false)

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

        const name = p.name
        if (!name) return

        // 2) Bookings (include venue)
        const rawBookings = await api<TBooking[]>(
          `/holidaze/profiles/${encodeURIComponent(name)}/bookings?_venue=true`,
          { token: token ?? undefined, useApiKey: true }
        )
        if (!mounted) return
        setBookings(Array.isArray(rawBookings) ? rawBookings : [])

        // 3) Venues for managers (include bookings)
        if (p.venueManager) {
          const v = await api<TVenue[]>(
            `/holidaze/profiles/${encodeURIComponent(name)}/venues?_bookings=true`,
            { token: token ?? undefined, useApiKey: true }
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

    if (token) load()
    else setLoading(false)

    return () => {
      mounted = false
    }
  }, [token])

  // Only upcoming bookings (>= today), sorted by start date ascending
  const upcomingBookings = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookings
      .filter((b) => new Date(b.dateFrom) >= today)
      .sort((a, b) => +new Date(a.dateFrom) - +new Date(b.dateFrom))
  }, [bookings])

  return (
    <AuthGate>
      <main className="pt-8 md:pt-12 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {loading && <p className="body muted">Loading your profile…</p>}
        {error && !loading && <p className="body text-red-600">{error}</p>}

        {profile && (
          <>
            <ProfileHeader
              profile={profile}
              onEditAvatar={() => setAvatarOpen(true)}
            />

            <ProfileActions
              role={profile.venueManager ? 'manager' : 'customer'}
            />

            {profile.venueManager && (
              <section className="mt-10">
                <h2 className="h2 mb-4">My Venues</h2>
                <ManagerVenues venues={venues} />
              </section>
            )}

            <section className="mt-10">
              <h2 className="h2 mb-4">Upcoming Bookings</h2>
              <MyBookings bookings={upcomingBookings} />
            </section>

            <AvatarEditorModal
              open={avatarOpen}
              onClose={() => setAvatarOpen(false)}
            />
          </>
        )}

        {!loading && !error && !profile && (
          <p className="body muted">
            You’re not logged in. (If this persists, try refreshing.)
          </p>
        )}
      </main>
    </AuthGate>
  )
}
