// src/services/auth.ts
import { api } from '@/lib/api'
import { useSession } from '@/store/session'
import type {
  TRegisterInput,
  TLoginInput,
  TAuthResponse,
  TProfile,
} from '@/types/api'

/**
 * Optional include flags when fetching profiles.
 * Matches Holidaze docs: `_bookings`, `_venues`, and optional pagination.
 */
export type TProfileInclude = {
  _bookings?: boolean
  _venues?: boolean
  page?: number
  limit?: number
  sort?: string
}

/** Case-insensitive endsWith for email domain checks. */
function endsWithDomain(email: string, domain: string) {
  return email.toLowerCase().endsWith(domain.toLowerCase())
}

/**
 * Register a new user.
 *
 * Holidaze/Noroff requires a `@stud.noroff.no` email.
 * If `venueManager` is provided, it will be stored on the profile.
 *
 * @param {TRegisterInput & { venueManager?: boolean }} input
 *   - name, email, password, optional venueManager
 * @returns {Promise<TAuthResponse>} Auth payload with `accessToken` + user info
 *
 * @example
 * await registerUser({
 *   name: 'jane_doe',
 *   email: 'jane@stud.noroff.no',
 *   password: 'P@ssw0rd!',
 *   venueManager: true
 * })
 */
export async function registerUser(
  input: TRegisterInput & { venueManager?: boolean }
): Promise<TAuthResponse> {
  // Enforce Noroff student email rule
  if (!endsWithDomain(input.email, '@stud.noroff.no')) {
    throw new Error('Registration requires a @stud.noroff.no email.')
  }

  // Auth lives at the API root (NOT under /holidaze)
  return api<TAuthResponse>('/auth/register', {
    method: 'POST',
    body: input,
  })
}

/**
 * Log a user in and persist the session in Zustand + localStorage.
 *
 * @param {TLoginInput} input
 *   - email, password
 * @returns {Promise<TAuthResponse>} Auth payload with `accessToken` + user info
 *
 * @example
 * const res = await loginUser({ email, password })
 * console.log(res.accessToken)
 */
export async function loginUser(input: TLoginInput): Promise<TAuthResponse> {
  // Auth lives at the API root (NOT under /holidaze)
  const res = await api<TAuthResponse>('/auth/login', {
    method: 'POST',
    body: input,
  })

  // Store token + minimal user in Zustand
  useSession.getState().login({
    token: res.accessToken,
    user: {
      name: res.name,
      email: res.email,
      venueManager: res.venueManager,
    },
  })

  return res
}

/**
 * Fetch a specific profile by name.
 *
 * Holidaze profiles live under `/holidaze/profiles/:name`.
 * Use `TProfileInclude` flags to include `_bookings` or `_venues`.
 *
 * @param {string} name The profile name (username)
 * @param {TProfileInclude} [params] Optional include/pagination flags
 * @param {string} [token] Optional bearer token (required for some endpoints)
 * @returns {Promise<TProfile>} The profile object
 *
 * @example
 * const me = await getProfile('jane_doe', { _venues: true }, token)
 */
export async function getProfile(
  name: string,
  params?: TProfileInclude,
  token?: string
): Promise<TProfile> {
  const usp = new URLSearchParams()
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, String(v))
  })
  const qs = usp.toString() ? `?${usp.toString()}` : ''

  return api<TProfile>(`/holidaze/profiles/${encodeURIComponent(name)}${qs}`, {
    token,
  })
}

/**
 * Convenience helper: fetch the **current** logged-in user’s profile.
 * Reads token & username from the Zustand session store.
 *
 * @param {TProfileInclude} [params] Optional include/pagination flags
 * @returns {Promise<TProfile>} The current user's profile
 *
 * @throws If no session is present
 *
 * @example
 * const me = await getMyProfile({ _bookings: true })
 */

export async function getMyProfile(): Promise<TProfile> {
  const { token, user } = useSession.getState()
  if (!token || !user?.name) throw new Error('Not authenticated')

  const username = encodeURIComponent(user.name)
  return api<TProfile>(`/holidaze/profiles/${username}`, {
    token,
    useApiKey: true,
  })
}

/**
 * Optional helper to clear the stored session (wrapper for the store).
 *
 * @example
 * logoutUser()
 */
export function logoutUser() {
  useSession.getState().logout()
}
