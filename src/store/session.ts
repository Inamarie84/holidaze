'use client'

/**
 * Auth/session store (Zustand + persist).
 * - Persists { token, user } to localStorage
 * - Exposes helpers to login, logout, set user, and update avatar
 * - Tracks `hasHydrated` so you can gate UI on hydration
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
  hasHydrated: boolean
  login: (payload: { token: string; user: SessionUser }) => void
  logout: () => void
  setUser: (user: SessionUser) => void
  updateAvatar: (url: string, alt?: string) => void
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hasHydrated: false,

      login: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setUser: (user) => set({ user }),
      updateAvatar: (url, alt) => {
        const current = get().user
        if (!current) return
        set({
          user: { ...current, avatar: { url, ...(alt ? { alt } : {}) } },
        })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,

      /**
       * Defensive migration: ensure required keys exist when versions change.
       */
      migrate: async (persisted: unknown) => {
        type PersistedShape = Partial<Pick<SessionState, 'token' | 'user'>>
        const obj =
          persisted && typeof persisted === 'object'
            ? (persisted as PersistedShape)
            : {}

        const token =
          typeof obj.token === 'string' || obj.token === null ? obj.token : null
        const user =
          obj.user && typeof obj.user === 'object'
            ? (obj.user as SessionUser)
            : null

        const next = {
          token: token ?? null,
          user: user ?? null,
          hasHydrated: false,
        } as const

        return next as unknown as SessionState
      },

      /** Flip hasHydrated after rehydration completes. */
      onRehydrateStorage: () => () => {
        useSession.setState({ hasHydrated: true })
      },
    }
  )
)

/**
 * Tiny helper hook to gate UI until hydration.
 *
 * @example
 * const [{ token, user }, hydrated] = useSessionHydrated()
 */
export function useSessionHydrated() {
  const token = useSession((s) => s.token)
  const user = useSession((s) => s.user)
  const hasHydrated = useSession((s) => s.hasHydrated)
  return [{ token, user }, hasHydrated] as const
}
