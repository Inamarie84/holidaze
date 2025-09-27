import { api } from '@/lib/api'
import { holidazeApi } from '@/lib/holidaze'
import { useSession } from '@/store/session'
import { isNoroffStudentEmail, NOROFF_DOMAIN } from '@/utils/email'
import type {
  TRegisterInput,
  TLoginInput,
  TAuthResponse,
  TProfile,
} from '@/types/api'

/**
 * Register a new user.
 *
 * @remarks
 * UI validation can enforce domain requirements for all roles.
 * This function currently enforces the Noroff domain only for
 * venue managers. Adjust here if your policy changes.
 *
 * @param input - Registration payload (optionally includes venueManager flag)
 * @returns Auth response echoing created user fields
 * @throws Error if a manager registers without a {@link NOROFF_DOMAIN} email
 */
export async function registerUser(
  input: TRegisterInput & { venueManager?: boolean }
): Promise<TAuthResponse> {
  if (input.venueManager && !isNoroffStudentEmail(input.email)) {
    throw new Error(`Registration requires a ${NOROFF_DOMAIN} email.`)
  }

  return api<TAuthResponse>('/auth/register', {
    method: 'POST',
    body: input,
  })
}

/**
 * Log in and persist the session in the Zustand store.
 *
 * @param input - Login credentials
 * @returns Auth response (access token + profile fields)
 */
export async function loginUser(input: TLoginInput): Promise<TAuthResponse> {
  // Ensure we receive Holidaze-specific fields in the response
  const res = await api<TAuthResponse>('/auth/login?_holidaze=true', {
    method: 'POST',
    body: input,
  })

  useSession.getState().login({
    token: res.accessToken,
    user: {
      name: res.name,
      email: res.email,
      venueManager: !!res.venueManager,
      avatar: res.avatar,
    },
  })
  return res
}

/**
 * Fetch a specific profile by name.
 *
 * @param name - Profile (username)
 * @param params - Optional query flags (e.g., {_bookings: true})
 * @param token - Optional bearer token for private fields
 * @returns The requested profile
 */
export async function getProfile(
  name: string,
  params?: Record<string, string | number | boolean | undefined>,
  token?: string
): Promise<TProfile> {
  const usp = new URLSearchParams()
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, String(v))
  })
  const qs = usp.toString() ? `?${usp}` : ''
  return holidazeApi<TProfile>(`/profiles/${encodeURIComponent(name)}${qs}`, {
    method: 'GET',
    token: token ?? undefined,
  })
}

/**
 * Convenience: fetch the current user's profile (requires token).
 *
 * @returns The authenticated user's profile
 * @throws Error if not authenticated
 */
export async function getMyProfile(): Promise<TProfile> {
  const { token, user } = useSession.getState()
  if (!token || !user?.name) throw new Error('Not authenticated')
  return getProfile(user.name, undefined, token)
}

/** Clear the active session from the store. */
export function logoutUser() {
  useSession.getState().logout()
}
