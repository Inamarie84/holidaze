'use client'

import { useEffect, useMemo, useState } from 'react'
import AuthGate from '@/components/auth/AuthGate'
import { getMyProfile } from '@/services/auth'
import { api } from '@/lib/api'
import type { TProfile, TBooking, TVenue } from '@/types/api'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileHeaderSkeleton from '@/components/profile/ProfileHeaderSkeleton'
import ManagerVenuesSkeleton from '@/components/profile/ManagerVenuesSkeleton'
import BookingListSkeleton from '@/components/profile/BookingListSkeleton'
import ManagerVenues from '@/components/profile/ManagerVenues'
import MyBookings from '@/components/profile/MyBookings'
import { useSession } from '@/store/session'
import ProfileActions from '@/components/profile/ProfileActions'
import AvatarEditorModal from '@/components/profile/AvatarEditorModal'
import Skeleton from '@/components/ui/Skeleton'

export default function ProfilePage() {
  const { token } = useSession()
  const [profile, setProfile] = useState<TProfile | null>(null)

  // Customer’s personal bookings (only filled when NOT a manager)
  const [bookings, setBookings] = useState<TBooking[]>([])

  // Manager’s venues (+ each venue’s bookings)
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

        // 1) Who am I?
        const p = (await getMyProfile()) as TProfile
        if (!mounted) return
        setProfile(p)
        if (!p.name) return

        if (p.venueManager) {
          // 2a) MANAGER: get my venues with bookings so I can see upcoming bookings for my venues
          const v = await api<TVenue[]>(
            `/holidaze/profiles/${encodeURIComponent(p.name)}/venues?_bookings=true&_owner=true&sort=updated&sortOrder=desc`,
            { token: token ?? undefined, useApiKey: true }
          )
          if (!mounted) return
          setVenues(Array.isArray(v) ? v : [])
          setBookings([]) // ensure personal bookings list is empty/unused for managers
        } else {
          // 2b) CUSTOMER: get my personal bookings (with venue)
          const rawBookings = await api<TBooking[]>(
            `/holidaze/profiles/${encodeURIComponent(p.name)}/bookings?_venue=true`,
            { token: token ?? undefined, useApiKey: true }
          )
          if (!mounted) return
          setBookings(Array.isArray(rawBookings) ? rawBookings : [])
          setVenues([]) // no manager venues for customers
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

  // --- Helpers to partition bookings by time ---
  // Treat bookings as [dateFrom, dateTo) — past if dateTo < today (midnight)
  const partitionBookings = (list: TBooking[]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const past: TBooking[] = []
    const upcoming: TBooking[] = []
    for (const b of list) {
      const end = new Date(b.dateTo)
      if (end < today) past.push(b)
      else upcoming.push(b)
    }
    upcoming.sort((a, b) => +new Date(a.dateFrom) - +new Date(b.dateFrom))
    past.sort((a, b) => +new Date(b.dateFrom) - +new Date(a.dateFrom))
    return { upcoming, past }
  }

  // For CUSTOMERS: split their personal bookings
  const customerBookings = useMemo(
    () => partitionBookings(bookings),
    [bookings]
  )

  // For MANAGERS: flatten venue bookings into a single list (include venue on each)
  const managerVenueBookings = useMemo<TBooking[]>(() => {
    const out: TBooking[] = []
    for (const v of venues) {
      const bs = (v as any).bookings as TBooking[] | undefined
      if (!bs?.length) continue
      for (const b of bs) {
        out.push({ ...b, venue: v }) // ensure booking.venue exists for linking
      }
    }
    return out
  }, [venues])

  const managerUpcoming = useMemo(
    () => partitionBookings(managerVenueBookings).upcoming,
    [managerVenueBookings]
  )

  return (
    <AuthGate>
      <main className="pt-8 md:pt-12 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {error && !loading && <p className="body text-red-600">{error}</p>}

        {/* Loading skeletons */}
        {loading && (
          <>
            <ProfileHeaderSkeleton />

            {/* Quick actions row (skeleton buttons) */}
            <section aria-hidden className="mt-6">
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-40 rounded-lg" />
                <Skeleton className="h-10 w-28 rounded-lg" />
              </div>
            </section>

            {/* My Venues grid skeleton */}
            <section aria-hidden className="mt-10">
              <ManagerVenuesSkeleton />
            </section>

            {/* Bookings list skeleton */}
            <section aria-hidden className="mt-10">
              <h2 className="h2 mb-4">Upcoming Bookings</h2>
              <BookingListSkeleton />
            </section>
          </>
        )}

        {/* Loaded */}
        {profile && !loading && !error && (
          <>
            <ProfileHeader
              profile={profile}
              onEditAvatar={() => setAvatarOpen(true)}
              customerUpcomingCount={
                !profile.venueManager
                  ? customerBookings.upcoming.length
                  : undefined
              }
              managerUpcomingCount={
                profile.venueManager ? managerUpcoming.length : undefined
              }
              managerVenuesCount={
                profile.venueManager ? venues.length : undefined
              }
            />

            <ProfileActions
              role={profile.venueManager ? 'manager' : 'customer'}
            />

            {profile.venueManager ? (
              <>
                {/* Manager view */}
                <section className="mt-10">
                  <h2 className="h2 mb-4">My Venues</h2>
                  <ManagerVenues venues={venues} />
                </section>

                <section className="mt-10">
                  <h2 className="h2 mb-4">Upcoming bookings for your venues</h2>
                  <MyBookings
                    bookings={managerUpcoming}
                    emptyText="No upcoming bookings for your venues yet."
                  />
                </section>
              </>
            ) : (
              <>
                {/* Customer view */}
                <section className="mt-10">
                  <h2 className="h2 mb-4">Upcoming Bookings</h2>
                  <MyBookings
                    bookings={customerBookings.upcoming}
                    emptyText="No upcoming bookings yet."
                  />
                </section>

                <section className="mt-10">
                  <h2 className="h2 mb-4">Previous Bookings</h2>
                  <MyBookings
                    bookings={customerBookings.past}
                    emptyText="No previous bookings."
                  />
                </section>
              </>
            )}

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
