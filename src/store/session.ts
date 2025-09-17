// src/store/session.ts
'use client'

import { create } from 'zustand'

const STORAGE_KEY = 'holidaze_session'

export type SessionUser = {
  name: string
  email: string
  venueManager?: boolean
  avatar?: { url: string; alt?: string }
}

type SessionState = {
  token: string | null
  user: SessionUser | null
  login: (payload: { token: string; user: SessionUser }) => void
  logout: () => void
  hydrate: () => void
  setUser: (user: SessionUser) => void // ✅ added for avatar updates
}

export const useSession = create<SessionState>((set) => ({
  token: null,
  user: null,

  login: ({ token, user }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ token: null, user: null })
  },

  hydrate: () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as { token: string; user: SessionUser }
      if (parsed?.token && parsed?.user) {
        set({ token: parsed.token, user: parsed.user })
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  },

  setUser: (user) => {
    const token = useSession.getState().token
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
    set({ user })
  },
}))
