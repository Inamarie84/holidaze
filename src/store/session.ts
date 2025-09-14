// src/store/session.ts
'use client'

import { create } from 'zustand'

const STORAGE_KEY = 'holidaze_session'

export type SessionUser = {
  name: string
  email: string
  venueManager?: boolean
}

type SessionState = {
  token: string | null
  user: SessionUser | null
  /** Persist to localStorage and set in memory */
  login: (payload: { token: string; user: SessionUser }) => void
  /** Clear localStorage and memory */
  logout: () => void
  /** Restore from localStorage (call once on app mount) */
  hydrate: () => void
}

export const useSession = create<SessionState>((set) => ({
  token: null,
  user: null,

  login: ({ token, user }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
    } catch {
      /* ignore quota errors */
    }
    set({ token, user })
  },

  logout: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    set({ token: null, user: null })
  },

  hydrate: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as { token: string; user: SessionUser }
      if (parsed?.token && parsed?.user) {
        set({ token: parsed.token, user: parsed.user })
      }
    } catch {
      // bad JSON? just clear
      localStorage.removeItem(STORAGE_KEY)
    }
  },
}))
