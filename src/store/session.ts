// src/store/session.ts
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const STORAGE_KEY = 'holidaze_session'

export type SessionUser = {
  name: string
  email: string
  venueManager?: boolean
  avatar?: { url?: string; alt?: string }
}

type SessionState = {
  token: string | null
  user: SessionUser | null

  // existing API (kept for compatibility)
  login: (payload: { token: string; user: SessionUser }) => void
  logout: () => void
  setUser: (user: SessionUser | Partial<SessionUser>) => void

  // legacy: manual hydrate (noop now, persist handles it)
  hydrate: () => void

  // hydration flag so components can avoid flashing "logged out"
  _hasHydrated: boolean
  _setHasHydrated: (v: boolean) => void
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null }),

      setUser: (patch) =>
        set((s) => ({
          user: s.user
            ? { ...s.user, ...(patch as Partial<SessionUser>) }
            : ((patch as SessionUser) ?? null),
        })),

      // noop; left for backward compatibility
      hydrate: () => {},

      _hasHydrated: false,
      _setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // when state is rehydrated from localStorage, flip the flag
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true)
      },
      // (optional) version/migrate here later if needed
    }
  )
)
