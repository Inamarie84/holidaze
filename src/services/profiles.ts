import { holidazeApi } from '@/lib/holidaze'
import { useSession } from '@/store/session'
import type {
  TProfile,
  TBooking,
  TVenue,
  TVenueWithBookings,
} from '@/types/api'

/**
 * Pull token + username from the session store.
 *
 * @returns The bearer token and username
 * @throws Error if not authenticated
 */
function requireAuth(): { token: string; username: string } {
  const { token, user } = useSession.getState()
  const username = user?.name
  if (!token || !username) throw new Error('Not authenticated')
  return { token, username }
}

/**
 * Get the current user's profile.
 *
 * @returns The authenticated user's profile
 */
export async function getMyProfile(): Promise<TProfile> {
  const { token, username } = requireAuth()
  return holidazeApi<TProfile>(`/profiles/${encodeURIComponent(username)}`, {
    method: 'GET',
    token,
  })
}

/**
 * Update the current user's avatar via the profile endpoint.
 *
 * @param url - Absolute image URL
 * @param alt - Optional alt text
 * @returns Updated profile
 */
export async function updateMyAvatar(
  url: string,
  alt?: string
): Promise<TProfile> {
  const { token, username } = requireAuth()
  return holidazeApi<TProfile>(`/profiles/${encodeURIComponent(username)}`, {
    method: 'PUT',
    token,
    body: { avatar: { url, ...(alt ? { alt } : {}) } },
  })
}

/**
 * Update avatar and immediately sync the in-memory session so the UI updates.
 *
 * @param url - Absolute image URL
 * @param alt - Optional alt text
 * @returns Updated profile
 */
export async function updateMyAvatarAndSync(
  url: string,
  alt?: string
): Promise<TProfile> {
  const updated = await updateMyAvatar(url, alt)

  type SessionSync = {
    updateAvatar?: (u: string, a?: string) => void
    setUser?: (u: {
      name: string
      email: string
      venueManager?: boolean
      avatar?: { url: string; alt?: string }
    }) => void
  }

  const store = useSession.getState() as SessionSync

  if (typeof store.updateAvatar === 'function') {
    store.updateAvatar(updated.avatar?.url ?? url, updated.avatar?.alt ?? alt)
  } else if (typeof store.setUser === 'function') {
    store.setUser({
      name: updated.name,
      email: updated.email,
      venueManager: updated.venueManager,
      avatar: updated.avatar,
    })
  }
  return updated
}

/**
 * Get the authenticated customer's bookings, including the linked venue.
 *
 * @returns List of bookings with `_venue=true`
 */
export async function getMyBookings(): Promise<TBooking[]> {
  const { token, username } = requireAuth()
  return holidazeApi<TBooking[]>(
    `/profiles/${encodeURIComponent(username)}/bookings?_venue=true`,
    { method: 'GET', token }
  )
}

/**
 * Get venues owned by the authenticated user (manager view), no bookings.
 *
 * @returns List of venues the user manages
 */
export async function getMyVenues(): Promise<TVenue[]> {
  const { token, username } = requireAuth()
  return holidazeApi<TVenue[]>(
    `/profiles/${encodeURIComponent(username)}/venues`,
    { method: 'GET', token }
  )
}

/**
 * Get venues owned by the authenticated user (manager view),
 * including bookings and owner object. Sorted by `updated desc`.
 *
 * @returns Venues the user manages, with bookings and owner
 */
export async function getMyVenuesWithBookings(): Promise<TVenueWithBookings[]> {
  const { token, username } = requireAuth()
  const qs = `?_bookings=true&_owner=true&sort=updated&sortOrder=desc`
  return holidazeApi<TVenueWithBookings[]>(
    `/profiles/${encodeURIComponent(username)}/venues${qs}`,
    { method: 'GET', token }
  )
}
