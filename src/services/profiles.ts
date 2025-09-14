// src/services/profiles.ts
import { api } from '@/lib/api'
import { useSession } from '@/store/session'
import type { TProfile, TBooking, TVenue } from '@/types/api'

/**
 * Resolve current token & username from the client store.
 * Throws if unauthenticated.
 */
function requireAuth() {
  const { token, user } = useSession.getState()
  if (!token || !user?.name) throw new Error('Not authenticated')
  return { token, username: user.name }
}

/**
 * Get the current user's profile.
 * Uses /profiles/:name
 */
export async function getMyProfile(): Promise<TProfile> {
  const { token, username } = requireAuth()
  return api<TProfile>(`/holidaze/profiles/${encodeURIComponent(username)}`, {
    token,
  })
}

/**
 * Update avatar for current user.
 * API shape: { avatar: { url, alt? } }
 */
export async function updateMyAvatar(
  url: string,
  alt?: string
): Promise<TProfile> {
  const { token, username } = requireAuth()
  return api<TProfile>(`/holidaze/profiles/${encodeURIComponent(username)}`, {
    method: 'PUT',
    token,
    body: { avatar: { url, alt } },
  })
}

/**
 * Get upcoming bookings for current user.
 * You can add includes like ?_venue=true later.
 */
export async function getMyBookings(): Promise<TBooking[]> {
  const { token, username } = requireAuth()
  return api<TBooking[]>(
    `/holidaze/profiles/${encodeURIComponent(username)}/bookings?_venue=true`,
    { token }
  )
}

/**
 * Get venues owned by current user (for managers).
 */
export async function getMyVenues(): Promise<TVenue[]> {
  const { token, username } = requireAuth()
  return api<TVenue[]>(
    `/holidaze/profiles/${encodeURIComponent(username)}/venues`,
    {
      token,
    }
  )
}
