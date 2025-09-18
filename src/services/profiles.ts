// src/services/profiles.ts
import { api } from '@/lib/api'
import { useSession } from '@/store/session'
import type { TProfile, TBooking, TVenue } from '@/types/api'

/** Pull token + username from Zustand or throw */
function requireAuth() {
  const { token, user } = useSession.getState()
  const username = user?.name
  if (!token || !username) throw new Error('Not authenticated')
  return { token, username }
}

/** Get the current user's profile via their username (your preferred pattern) */
export async function getMyProfile(): Promise<TProfile> {
  const { token, username } = requireAuth()
  return api<TProfile>(`/holidaze/profiles/${encodeURIComponent(username)}`, {
    token,
    useApiKey: true,
  })
}

/** Update your avatar using the username endpoint; returns the updated profile */
export async function updateMyAvatar(
  url: string,
  alt?: string
): Promise<TProfile> {
  const { token, username } = requireAuth()
  return api<TProfile>(`/holidaze/profiles/${encodeURIComponent(username)}`, {
    method: 'PUT',
    token,
    useApiKey: true,
    body: { avatar: { url, alt } },
  })
}

/**
 * Update avatar *and* immediately sync the session store so UI updates
 * (navbar/profile header) without a reload.
 */
export async function updateMyAvatarAndSync(
  url: string,
  alt?: string
): Promise<TProfile> {
  const updated = await updateMyAvatar(url, alt)
  const { setUser } = useSession.getState()
  setUser({
    name: updated.name,
    email: updated.email,
    venueManager: updated.venueManager,
    avatar: updated.avatar,
  } as any)
  return updated
}

/** Upcoming bookings for current user (with venue included) */
export async function getMyBookings(): Promise<TBooking[]> {
  const { token, username } = requireAuth()
  return api<TBooking[]>(
    `/holidaze/profiles/${encodeURIComponent(username)}/bookings?_venue=true`,
    { token, useApiKey: true }
  )
}

/** Venues owned by current user (optionally include bookings) */
export async function getMyVenues(opts?: {
  includeBookings?: boolean
}): Promise<TVenue[]> {
  const { token, username } = requireAuth()
  const qs = opts?.includeBookings ? '?_bookings=true' : ''
  return api<TVenue[]>(
    `/holidaze/profiles/${encodeURIComponent(username)}/venues${qs}`,
    { token, useApiKey: true }
  )
}
