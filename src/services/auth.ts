import { api } from '@/lib/api'
import { useSession } from '@/store/session'

type RegisterInput = {
  name: string
  email: string
  password: string
  venueManager?: boolean
}

type LoginInput = {
  email: string
  password: string
}

type AuthResponse = {
  accessToken: string
  name: string
  email: string
  venueManager?: boolean
}

/** Register a new user (Noroff API). */
export async function registerUser(input: RegisterInput) {
  // Noroff typically requires @stud.noroff.no. You can hard-block or warn.
  if (input.venueManager && !input.email.endsWith('@stud.noroff.no')) {
    throw new Error('Venue Manager requires a @stud.noroff.no email.')
  }
  return api<AuthResponse>('/auth/register', { method: 'POST', body: input })
}

/** Login and store token+user in Zustand. */
export async function loginUser(input: LoginInput) {
  const res = await api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: input,
  })
  useSession.getState().login({
    token: res.accessToken,
    user: { name: res.name, email: res.email, venueManager: res.venueManager },
  })
  return res
}

/** Example: get the current profile using the token from Zustand (client-only). */
export async function getMyProfile() {
  const token = useSession.getState().token
  if (!token) throw new Error('Not authenticated')
  return api('/profiles/me', { token })
}
