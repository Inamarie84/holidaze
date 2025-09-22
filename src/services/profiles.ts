// src/services/profiles.ts
import { holidazeApi } from '@/lib/holidaze'
import { useSession } from '@/store/session'
import type {
  TProfile,
  TBooking,
  TVenue,
  TVenueWithBookings,
} from '@/types/api'

/**
 * Require an authenticated session; returns token and username.
 * @throws Error if no session found.
 */
function requireAuth() {
  const { token, user } = useSession.getState()
  const username = user?.name
  if (!token || !username) throw new Error('Not authenticated')
  return { token, username }
}

/**
 * Get the current user's profile using the stored session username.
 * Always sends the Noroff API key via holidazeApi().
 */
export async function getMyProfile(): Promise<TProfile> {
  const { token, username } = requireAuth()
  return holidazeApi<TProfile>(`/profiles/${encodeURIComponent(username)}`, {
    method: 'GET',
    token,
  })
}

/**
 * Update your avatar via the profile media endpoint.
 * Noroff v2: PUT /holidaze/profiles/:name/media  { avatar: { url, alt? } }
 * @returns The updated profile.
 */
export async function updateMyAvatar(
  url: string,
  alt?: string
): Promise<TProfile> {
  const { token, username } = requireAuth()
  return holidazeApi<TProfile>(
    `/profiles/${encodeURIComponent(username)}/media`,
    {
      method: 'PUT',
      token,
      body: { avatar: { url, ...(alt ? { alt } : {}) } },
    }
  )
}

/**
 * Update avatar and immediately sync the session store so UI updates
 * (navbar/profile header) without a reload. Falls back gracefully
 * depending on which mutator your store exposes.
 */
export async function updateMyAvatarAndSync(
  url: string,
  alt?: string
): Promise<TProfile> {
  const updated = await updateMyAvatar(url, alt)

  const store = useSession.getState() as any
  // Preferred: a small, focused mutator
  if (typeof store.updateAvatar === 'function') {
    store.updateAvatar(updated.avatar?.url ?? url)
  }
  // Alternate: whole-user setter
  else if (typeof store.setUser === 'function') {
    store.setUser({
      name: updated.name,
      email: updated.email,
      venueManager: updated.venueManager,
      avatar: updated.avatar,
    })
  }
  // Otherwise the calling component can still patch local state via onSaved(updated)
  return updated
}

/**
 * Get the current user's personal bookings (with venue included).
 */
export async function getMyBookings(): Promise<TBooking[]> {
  const { token, username } = requireAuth()
  return holidazeApi<TBooking[]>(
    `/profiles/${encodeURIComponent(username)}/bookings?_venue=true`,
    { method: 'GET', token }
  )
}

/**
 * Get venues owned by the current user (no bookings).
 */
export async function getMyVenues(): Promise<TVenue[]> {
  const { token, username } = requireAuth()
  return holidazeApi<TVenue[]>(
    `/profiles/${encodeURIComponent(username)}/venues`,
    { method: 'GET', token }
  )
}

/**
 * Get venues owned by the current user, including bookings and owner.
 * Sorted by updated desc (matches your UI expectation).
 */
export async function getMyVenuesWithBookings(): Promise<TVenueWithBookings[]> {
  const { token, username } = requireAuth()
  const qs = `?_bookings=true&_owner=true&sort=updated&sortOrder=desc`
  return holidazeApi<TVenueWithBookings[]>(
    `/profiles/${encodeURIComponent(username)}/venues${qs}`,
    { method: 'GET', token }
  )
}
