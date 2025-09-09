// src/services/auth.ts
import { api } from '@/lib/api'

export async function register(name: string, email: string, password: string) {
  return api('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  })
}

export async function login(email: string, password: string) {
  // returns { accessToken, name, email, venueManager? } in data
  return api<{
    accessToken: string
    name: string
    email: string
    venueManager?: boolean
  }>('/auth/login', { method: 'POST', body: { email, password } })
}
