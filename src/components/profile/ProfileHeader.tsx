// src/components/profile/ProfileHeader.tsx
'use client'

import Image from 'next/image'
import { useSession } from '@/store/session'
import type { TProfile } from '@/types/api'

type Props = {
  profile: TProfile
  onEditAvatar?: () => void
  // Optional, so we can show role-appropriate counts
  customerUpcomingCount?: number
  managerUpcomingCount?: number
  managerVenuesCount?: number
}

export default function ProfileHeader({
  profile,
  onEditAvatar,
  customerUpcomingCount,
  managerUpcomingCount,
  managerVenuesCount,
}: Props) {
  const sessionUser = useSession((s) => s.user)

  const displayName = profile.name || sessionUser?.name || ''
  const displayEmail = profile.email || sessionUser?.email || ''
  const avatar =
    profile.avatar?.url || sessionUser?.avatar?.url || '/images/placeholder.jpg'
  const avatarAlt = profile.avatar?.alt || displayName || 'User avatar'

  const isManager = !!profile.venueManager

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-black/10">
          <Image
            src={avatar}
            alt={avatarAlt}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        <div>
          <h1 className="h1 text-xl sm:text-2xl font-semibold leading-tight">
            {displayName}
          </h1>
          <p className="text-sm text-gray-600">{displayEmail}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-sm">
          {isManager ? 'Venue Manager' : 'Customer'}
        </span>

        {isManager ? (
          <>
            {typeof managerVenuesCount === 'number' && (
              <span className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-sm">
                {managerVenuesCount} venues
              </span>
            )}
            {typeof managerUpcomingCount === 'number' && (
              <span className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-sm">
                {managerUpcomingCount} upcoming bookings
              </span>
            )}
          </>
        ) : (
          typeof customerUpcomingCount === 'number' && (
            <span className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-sm">
              {customerUpcomingCount} upcoming bookings
            </span>
          )
        )}

        {onEditAvatar && (
          <button
            onClick={onEditAvatar}
            className="ml-2 inline-flex items-center rounded-lg border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5 cursor-pointer"
          >
            Edit avatar
          </button>
        )}
      </div>
    </header>
  )
}
