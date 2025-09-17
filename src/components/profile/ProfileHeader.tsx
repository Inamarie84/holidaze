// src/components/profile/ProfileHeader.tsx
'use client'

import Image from 'next/image'
import type { TProfile } from '@/types/api'

export default function ProfileHeader({
  profile,
  onEditAvatar,
}: {
  profile: TProfile
  onEditAvatar?: () => void
}) {
  const avatar = profile.avatar?.url || '/images/placeholder.jpg'
  const avatarAlt = profile.avatar?.alt || profile.name

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
          <h1 className="h1">{profile.name}</h1>
          <p className="muted">{profile.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-sm">
          {profile.venueManager ? 'Venue Manager' : 'Customer'}
        </span>
        {typeof profile._count?.bookings === 'number' && (
          <span className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-sm">
            {profile._count.bookings} bookings
          </span>
        )}
        {typeof profile._count?.venues === 'number' && profile.venueManager && (
          <span className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-sm">
            {profile._count.venues} venues
          </span>
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
