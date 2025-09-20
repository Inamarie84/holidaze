// src/app/profile/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import AuthGate from '@/components/auth/AuthGate'
import { getMyProfile } from '@/services/auth'
import { api } from '@/lib/api'
import type { TProfile, TBooking, TVenue } from '@/types/api'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileHeaderSkeleton from '@/components/profile/ProfileHeaderSkeleton'
import ManagerVenues from '@/components/profile/ManagerVenues'
import MyBookings from '@/components/profile/MyBookings'
import { useSession } from '@/store/session'
import ProfileActions from '@/components/profile/ProfileActions'
import AvatarEditorModal from '@/components/profile/AvatarEditorModal'
import Skeleton from '@/components/ui/Skeleton'

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

        const p = (await getMyProfile()) as TProfile
        if (!mounted) return
        setProfile(p)

        if (!p.name) return

        const rawBookings = await api<TBooking[]>(
          `/holidaze/profiles/${encodeURIComponent(p.name)}/bookings?_venue=true`,
          { token: token ?? undefined, useApiKey: true }
        )
        if (!mounted) return
        setBookings(Array.isArray(rawBookings) ? rawBookings : [])

        if (p.venueManager) {
          const v = await api<TVenue[]>(
            `/holidaze/profiles/${encodeURIComponent(p.name)}/venues?_bookings=true&_owner=true&sort=created&sortOrder=desc`,
            { token: token ?? undefined, useApiKey: true }
          )
          if (!mounted) return
          setVenues(Array.isArray(v) ? v : [])
        } else {
          setVenues([])
        }
      } catch (err: unknown) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load profile')
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

  // Partition bookings into upcoming/current vs past
  // Treat bookings as [dateFrom, dateTo) — past if dateTo < today (midnight)
  const { upcomingBookings, pastBookings } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const past: TBooking[] = []
    const upcoming: TBooking[] = []

    for (const b of bookings) {
      const end = new Date(b.dateTo)
      if (end < today) past.push(b)
      else upcoming.push(b) // includes “current” and future
    }

    upcoming.sort((a, b) => +new Date(a.dateFrom) - +new Date(b.dateFrom))
    past.sort((a, b) => +new Date(b.dateFrom) - +new Date(a.dateFrom)) // newest past first

    return { upcomingBookings: upcoming, pastBookings: past }
  }, [bookings])

  return (
    <AuthGate>
      <main className="pt-8 md:pt-12 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {error && !loading && <p className="body text-red-600">{error}</p>}

        {/* Loading skeletons */}
        {loading && (
          <>
            <ProfileHeaderSkeleton />
            <section aria-hidden className="mt-6">
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-40 rounded-lg" />
                <Skeleton className="h-10 w-28 rounded-lg" />
              </div>
            </section>

            <section aria-hidden className="mt-10">
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-black/10 bg-white"
                  >
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20 rounded-lg" />
                        <Skeleton className="h-8 w-16 rounded-lg" />
                        <Skeleton className="h-8 w-16 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section aria-hidden className="mt-10">
              <Skeleton className="h-7 w-48 mb-4" />
              <div className="rounded-xl border border-black/10 bg-white divide-y divide-black/10">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 flex items-center justify-between"
                  >
                    <div>
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-4 w-56" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Loaded */}
        {profile && !loading && !error && (
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
              <MyBookings
                bookings={upcomingBookings}
                emptyText="No upcoming bookings yet."
              />
            </section>

            <section className="mt-10">
              <h2 className="h2 mb-4">Previous Bookings</h2>
              <MyBookings
                bookings={pastBookings}
                emptyText="No previous bookings."
              />
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
