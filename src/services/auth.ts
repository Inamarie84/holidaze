// src/services/auth.ts
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
 * a Noroff student email is required.
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

/** Log a user in and persist the session. */
export async function loginUser(input: TLoginInput): Promise<TAuthResponse> {
  // Add _holidaze=true so we always get venueManager/avatar/banner in response
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

/** Fetch a specific profile by name (needs API key; token optional for private fields). */
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

/** Convenience: fetch current user's profile (requires token). */
export async function getMyProfile(): Promise<TProfile> {
  const { token, user } = useSession.getState()
  if (!token || !user?.name) throw new Error('Not authenticated')
  return getProfile(user.name, undefined, token)
}

export function logoutUser() {
  useSession.getState().logout()
}
