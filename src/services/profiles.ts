// src/services/profiles.ts
import { api } from '@/lib/api'
import { useSession } from '@/store/session'
import type { TProfile, TBooking, TVenue } from '@/types/api'

function requireAuth() {
  const { token, user } = useSession.getState()
  if (!token || !user?.name) throw new Error('Not authenticated')
  return { token, username: user.name }
}

/** Get current user's profile */
export async function getMyProfile(): Promise<TProfile> {
  const { token, user } = useSession.getState()
  if (!token || !user?.name) throw new Error('Not authenticated')

  const username = encodeURIComponent(user.name)
  return api<TProfile>(`/holidaze/profiles/${username}`, {
    token,
    useApiKey: true,
  })
}

/** Pure: update avatar; returns updated profile */
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
 * Helper: update avatar AND sync Zustand/localStorage immediately.
 * Use this if you don’t want to call setUser in your components.
 */
export async function updateMyAvatarAndSync(
  url: string,
  alt?: string
): Promise<TProfile> {
  const updated = await updateMyAvatar(url, alt)
  const { setUser } = useSession.getState()
  setUser({
    // map TProfile -> SessionUser shape if needed
    name: updated.name,
    email: updated.email,
    venueManager: updated.venueManager,
    avatar: updated.avatar,
  } as any)
  return updated
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
