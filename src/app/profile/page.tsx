// src/app/profile/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
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

/**
 * ProfilePage
 * Shows current user's profile, bookings (customer), and venues+bookings (manager).
 */
export default function ProfilePage() {
  const [profile, setProfile] = useState<TProfile | null>(null)
  const [bookings, setBookings] = useState<TBooking[]>([])
  const [venues, setVenues] = useState<TVenueWithBookings[]>([])
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
        const me = await getMyProfile()
        if (!mounted) return
        setProfile(me)

        // 2) Role-based fetches
        if (me.venueManager) {
          const vs = await getMyVenuesWithBookings()
          if (!mounted) return
          setVenues(Array.isArray(vs) ? vs : [])
          setBookings([]) // managers don't use personal bookings list here
        } else {
          const bs = await getMyBookings()
          if (!mounted) return
          setBookings(Array.isArray(bs) ? bs : [])
          setVenues([]) // customers don't manage venues
        }
      } catch (err) {
        if (!mounted) return
        const msg =
          err instanceof Error ? err.message : 'Failed to load profile'
        setError(msg)
      } finally {
        mounted && setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  // CUSTOMER: split personal bookings
  const customer = useMemo(() => partitionBookings(bookings), [bookings])

  // MANAGER: flatten venue bookings with venue attached
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

  return (
    <AuthGate>
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

        {/* loading state */}
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
            <section aria-hidden className="mt-10">
              <ManagerVenuesSkeleton />
            </section>
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

            <ProfileActions
              role={profile.venueManager ? 'manager' : 'customer'}
            />

            {profile.venueManager ? (
              <>
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
                <section className="mt-10">
                  <h2 className="h2 mb-4">Upcoming Bookings</h2>
                  <MyBookings
                    bookings={customer.upcoming}
                    emptyText="No upcoming bookings yet."
                  />
                </section>

                <section className="mt-10">
                  <h2 className="h2 mb-4">Previous Bookings</h2>
                  <MyBookings
                    bookings={customer.past}
                    emptyText="No previous bookings."
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

        {!loading && !error && !profile && (
          <p className="body muted" aria-live="polite">
            You’re not logged in. (If this persists, try refreshing.)
          </p>
        )}
      </main>
    </AuthGate>
  )
}
