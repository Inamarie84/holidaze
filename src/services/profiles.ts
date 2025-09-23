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
 * Pulls the current token and username from the session store.
 * Throws if not authenticated.
 *
 * @throws {Error} When no token or username is present in the session.
 * @returns {{ token: string; username: string }} The auth token and username.
 */
function requireAuth() {
  const { token, user } = useSession.getState()
  const username = user?.name
  if (!token || !username) throw new Error('Not authenticated')
  return { token, username }
}

/**
 * Get the current user's profile.
 *
 * Makes: `GET /holidaze/profiles/:username`
 *
 * @example
 * const me = await getMyProfile()
 * console.log(me.email)
 *
 * @returns {Promise<TProfile>} The authenticated user's profile.
 */
export async function getMyProfile(): Promise<TProfile> {
  const { token, username } = requireAuth()
  return holidazeApi<TProfile>(`/profiles/${encodeURIComponent(username)}`, {
    method: 'GET',
    token,
  })
}

/**
 * Update the current user's avatar.
 *
 * NOTE: The Holidaze API updates avatars via the profile endpoint:
 * `PUT /holidaze/profiles/:username` with `{ avatar: { url, alt? } }`.
 * Do **not** call `/media` (that returns 404).
 *
 * @example
 * await updateMyAvatar('https://images.example.com/me.jpg', 'My avatar')
 *
 * @param {string} url - Absolute URL to the avatar image.
 * @param {string} [alt] - Optional alt text for the image.
 * @returns {Promise<TProfile>} The updated profile after the change.
 * @throws {Error} If not authenticated or the API rejects the payload.
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
 * Update avatar and immediately sync the in-memory session so the UI
 * reflects the change (e.g., navbar/profile header) without a reload.
 *
 * Tries `session.updateAvatar(url, alt)` first if your store exposes it,
 * otherwise falls back to `session.setUser(updatedUser)`.
 *
 * @example
 * const profile = await updateMyAvatarAndSync(newUrl, 'Avatar alt')
 * console.log(profile.avatar?.url)
 *
 * @param {string} url - Absolute URL to the avatar image.
 * @param {string} [alt] - Optional alt text for the image.
 * @returns {Promise<TProfile>} The updated profile.
 */
export async function updateMyAvatarAndSync(
  url: string,
  alt?: string
): Promise<TProfile> {
  const updated = await updateMyAvatar(url, alt)

  const store = useSession.getState() as any
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
 * Get the authenticated user's personal bookings (as a customer),
 * including the associated venue on each booking.
 *
 * Makes: `GET /holidaze/profiles/:username/bookings?_venue=true`
 *
 * @example
 * const bookings = await getMyBookings()
 * console.log(bookings[0].venue?.name)
 *
 * @returns {Promise<TBooking[]>} List of bookings with `_venue=true`.
 */
export async function getMyBookings(): Promise<TBooking[]> {
  const { token, username } = requireAuth()
  return holidazeApi<TBooking[]>(
    `/profiles/${encodeURIComponent(username)}/bookings?_venue=true`,
    { method: 'GET', token }
  )
}

/**
 * Get venues owned by the authenticated user (manager view), without bookings.
 *
 * Makes: `GET /holidaze/profiles/:username/venues`
 *
 * @example
 * const venues = await getMyVenues()
 * console.log(venues.length)
 *
 * @returns {Promise<TVenue[]>} List of venues the user manages.
 */
export async function getMyVenues(): Promise<TVenue[]> {
  const { token, username } = requireAuth()
  return holidazeApi<TVenue[]>(
    `/profiles/${encodeURIComponent(username)}/venues`,
    { method: 'GET', token }
  )
}

/**
 * Get venues owned by the authenticated user (manager view), including
 * bookings and the owner object. Results are sorted by `updated desc`.
 *
 * Makes:
 * `GET /holidaze/profiles/:username/venues?_bookings=true&_owner=true&sort=updated&sortOrder=desc`
 *
 * @example
 * const venues = await getMyVenuesWithBookings()
 * const firstVenueBookings = venues[0]?.bookings ?? []
 *
 * @returns {Promise<TVenueWithBookings[]>}
 * Venues the user manages, each with `bookings` and `owner`.
 */
export async function getMyVenuesWithBookings(): Promise<TVenueWithBookings[]> {
  const { token, username } = requireAuth()
  const qs = `?_bookings=true&_owner=true&sort=updated&sortOrder=desc`
  return holidazeApi<TVenueWithBookings[]>(
    `/profiles/${encodeURIComponent(username)}/venues${qs}`,
    { method: 'GET', token }
  )
}
