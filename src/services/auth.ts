// src/services/auth.ts
import { api } from '@/lib/api'
import type { TAuthResponse, TRegisterInput, TLoginInput } from '@/types/api'
import { useSession } from '@/store/session'

/**
 * Register a new user.
 * The API supports "venueManager" on register. We enforce @stud.noroff.no.
 */
export async function registerUser(
  input: TRegisterInput & { venueManager?: boolean }
) {
  // Safety: block non-Noroff student emails
  if (!/@stud\.noroff\.no$/i.test(input.email)) {
    throw new Error('Please use your @stud.noroff.no email to register.')
  }

  // API expects: { name, email, password, venueManager? }
  return api<
    TAuthResponse | { name: string; email: string; venueManager?: boolean }
  >('/auth/register', {
    method: 'POST',
    body: {
      name: input.name.trim(),
      email: input.email.trim(),
      password: input.password, // keep as-is
      venueManager: Boolean(input.venueManager),
    },
  })
}

/**
 * Login user and receive accessToken + basic user info.
 */
export async function loginUser(input: TLoginInput) {
  return api<TAuthResponse>('/auth/login', {
    method: 'POST',
    body: {
      email: input.email.trim(),
      password: input.password,
    },
  })
}

/**
 * Fetch the current logged-in user's profile.
 * Requires a valid access token in the session store.
 */
export async function getMyProfile() {
  const token = useSession.getState().token
  if (!token) throw new Error('Not authenticated')

  return api('/profiles/me', { token })
}
