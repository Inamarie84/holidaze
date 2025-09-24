// src/app/profile/page.tsx
'use client'

import { useEffect, useMemo, useRef, useState, Suspense } from 'react'
import AuthGate from '@/components/auth/AuthGate'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileHeaderSkeleton from '@/components/profile/ProfileHeaderSkeleton'
import ManagerVenuesSkeleton from '@/components/profile/ManagerVenuesSkeleton'
import BookingListSkeleton from '@/components/profile/BookingListSkeleton'
import ManagerVenues from '@/components/profile/ManagerVenues'
import MyBookings from '@/components/profile/MyBookings'
import ProfileActions from '@/components/profile/ProfileActions'
import AvatarEditorModal from '@/components/profile/AvatarEditorModal'
import Skeleton from '@/components/ui/Skeleton'
import type { TProfile, TBooking, TVenueWithBookings } from '@/types/api'
import {
  getMyProfile,
  getMyBookings,
  getMyVenuesWithBookings,
} from '@/services/profiles'
import { partitionBookings } from '@/utils/dates'
import { useSession } from '@/store/session'

// Never statically prerender this page
export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const { token, user, hasHydrated } = useSession()

  const [profile, setProfile] = useState<TProfile | null>(null)
  const [bookings, setBookings] = useState<TBooking[]>([])
  const [venues, setVenues] = useState<TVenueWithBookings[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [avatarOpen, setAvatarOpen] = useState(false)

  const likelyManager = !!user?.venueManager

  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    // Reset while hydrating or when logged out
    if (!hasHydrated || !token || !user?.name) {
      setProfile(null)
      setBookings([])
      setVenues([])
      setError(null)
      setLoading(true)
      return
    }

    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)

        const me = await getMyProfile()
        if (cancelled || !mounted.current) return
        setProfile(me)

        if (me.venueManager) {
          const vs = await getMyVenuesWithBookings()
          if (cancelled || !mounted.current) return
          setVenues(Array.isArray(vs) ? vs : [])
          setBookings([])
        } else {
          const bs = await getMyBookings()
          if (cancelled || !mounted.current) return
          setBookings(Array.isArray(bs) ? bs : [])
          setVenues([])
        }
      } catch (err) {
        if (!mounted.current) return
        const msg =
          err instanceof Error ? err.message : 'Failed to load profile'
        setError(msg)
      } finally {
        if (!mounted.current) return
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [hasHydrated, token, user?.name])

  const customer = useMemo(() => partitionBookings(bookings), [bookings])

  const managerVenueBookings = useMemo<TBooking[]>(() => {
    const out: TBooking[] = []
    for (const v of venues) {
      if (!v.bookings?.length) continue
      for (const b of v.bookings) out.push({ ...b, venue: v })
    }
    return out
  }, [venues])

  const managerUpcoming = useMemo(
    () => partitionBookings(managerVenueBookings).upcoming,
    [managerVenueBookings]
  )

  // One shared skeleton block (used for Suspense + AuthGate fallback)
  const SkeletonPage = (
    <main className="pt-8 md:pt-12 pb-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <ProfileHeaderSkeleton />
      <section aria-hidden className="mt-6">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
      </section>
      {likelyManager && (
        <section aria-hidden className="mt-10">
          <ManagerVenuesSkeleton />
        </section>
      )}
      <section aria-hidden className="mt-10">
        <h2 className="h2 mb-4">Upcoming Bookings</h2>
        <BookingListSkeleton />
      </section>
    </main>
  )

  return (
    <Suspense fallback={SkeletonPage}>
      <AuthGate redirectTo="/login" fallback={SkeletonPage}>
        <main
          id="main-content"
          className="pt-8 md:pt-12 pb-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
        >
          {/* errors */}
          {error && !loading && (
            <p role="alert" className="body text-red-600">
              {error}
            </p>
          )}

          {/* loading */}
          {loading && (
            <>
              <ProfileHeaderSkeleton />
              <section aria-hidden className="mt-6">
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </section>
              {likelyManager && (
                <section aria-hidden className="mt-10">
                  <ManagerVenuesSkeleton />
                </section>
              )}
              <section aria-hidden className="mt-10">
                <h2 className="h2 mb-4">Upcoming Bookings</h2>
                <BookingListSkeleton />
              </section>
            </>
          )}

          {/* loaded */}
          {profile && !loading && !error && (
            <>
              <ProfileHeader
                profile={profile}
                onEditAvatar={() => setAvatarOpen(true)}
                customerUpcomingCount={
                  profile.venueManager ? undefined : customer.upcoming.length
                }
                managerUpcomingCount={
                  profile.venueManager ? managerUpcoming.length : undefined
                }
                managerVenuesCount={
                  profile.venueManager ? venues.length : undefined
                }
              />

              <ProfileActions />

              {profile.venueManager ? (
                <>
                  <section className="mt-10">
                    <h2 className="h2 mb-4">My Venues</h2>
                    <ManagerVenues venues={venues} />
                  </section>

                  <section className="mt-10">
                    <h2 className="h2 mb-4">
                      Upcoming bookings for your venues
                    </h2>
                    <MyBookings
                      bookings={managerUpcoming}
                      emptyText="No upcoming bookings for your venues yet."
                    />
                  </section>
                </>
              ) : (
                <>
                  <section className="mt-10">
                    <h2 className="h2 mb-4">Upcoming Bookings</h2>
                    <MyBookings
                      bookings={customer.upcoming}
                      emptyText="No upcoming bookings yet."
                    />
                  </section>

                  <section className="mt-10">
                    <h2 className="h2 h2--muted mb-4">Previous Bookings</h2>
                    <MyBookings
                      bookings={customer.past}
                      emptyText="No previous bookings."
                      tone="muted"
                    />
                  </section>
                </>
              )}

              <AvatarEditorModal
                open={avatarOpen}
                onClose={() => setAvatarOpen(false)}
                onSaved={(p) => setProfile(p)}
              />
            </>
          )}

          {/* fallback if somehow no data and no error */}
          {!loading && !error && !profile && (
            <p className="body muted" aria-live="polite">
              You’re not logged in. (If this persists, try refreshing.)
            </p>
          )}
        </main>
      </AuthGate>
    </Suspense>
  )
}
