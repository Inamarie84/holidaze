// src/store/session.ts
'use client'
import { create } from 'zustand'

type User = { name: string; email: string; venueManager?: boolean }
type SessionState = {
  token: string | null
  user: User | null
  login: (payload: { token: string; user: User }) => void
  logout: () => void
  hydrate: () => void
}

export const useSession = create<SessionState>((set) => ({
  token: null,
  user: null,
  login: ({ token, user }) => {
    localStorage.setItem('session', JSON.stringify({ token, user }))
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('session')
    set({ token: null, user: null })
  },
  hydrate: () => {
    const raw = localStorage.getItem('session')
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { token: string; user: User }
        set({ token: parsed.token, user: parsed.user })
      } catch {}
    }
  },
}))
