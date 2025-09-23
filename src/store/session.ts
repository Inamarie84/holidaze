// src/store/session.ts
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/** LocalStorage key for persisted session blob. */
const STORAGE_KEY = 'holidaze_session'

/**
 * Minimal user payload we keep in the session store.
 * Mirrors the Noroff auth/profile fields your UI needs.
 */
export type SessionUser = {
  /** Profile name (acts as username). */
  name: string
  /** Primary email for the user. */
  email: string
  /** True when the user is a venue manager. */
  venueManager?: boolean
  /** Optional avatar media for quick header/UI rendering. */
  avatar?: { url: string; alt?: string }
}

/**
 * Zustand store state & actions for the authenticated session.
 * - `token` + `user` are persisted between reloads (via `zustand/persist`)
 * - `hasHydrated` flips to true after rehydration so you can avoid flicker
 */
type SessionState = {
  /** JWT access token (null when logged out). */
  token: string | null
  /** Minimal user info (null when logged out). */
  user: SessionUser | null
  /** Becomes true once the persisted state has been read from storage. */
  hasHydrated: boolean

  /**
   * Set the current session (persisted).
   * @example useSession.getState().login({ token, user })
   */
  login: (payload: { token: string; user: SessionUser }) => void

  /**
   * Clear the current session (persisted).
   * @example useSession.getState().logout()
   */
  logout: () => void

  /**
   * Replace the stored `user` object (e.g., after profile update).
   * @example useSession.getState().setUser(updatedUser)
   */
  setUser: (user: SessionUser) => void

  /**
   * Convenience mutator for avatar updates (keeps object stable).
   * @example useSession.getState().updateAvatar(url, alt)
   */
  updateAvatar: (url: string, alt?: string) => void
}

/**
 * Session store (Zustand + Persist).
 * - Persists to localStorage
 * - Includes a no-op migration so future version bumps won’t warn
 * - Exposes `hasHydrated` for flicker-free auth-gated UIs
 */
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
        set({ user: { ...current, avatar: { url, ...(alt ? { alt } : {}) } } })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,

      /**
       * Identity migration: ensures required keys exist and suppresses
       * "couldn't be migrated" warnings when versions change.
       */
      migrate: async (persisted: any /* previous shape */, _from: number) => {
        return {
          token: persisted?.token ?? null,
          user: persisted?.user ?? null,
          hasHydrated: false,
        } as SessionState
      },

      /**
       * Flip `hasHydrated` once rehydration finishes (success or error),
       * so components can render the correct auth UI after reloads.
       */
      onRehydrateStorage: () => (_state, _error) => {
        useSession.setState({ hasHydrated: true })
      },
    }
  )
)

/**
 * Optional tiny helper hook:
 * Returns `[session, hydrated]` so you can gate rendering until hydrated.
 *
 * @example
 * const [{ token, user }, hydrated] = useSessionHydrated()
 * if (!hydrated) return <Spinner />
 * return token ? <Dashboard/> : <Login/>
 */
export function useSessionHydrated() {
  const token = useSession((s) => s.token)
  const user = useSession((s) => s.user)
  const hasHydrated = useSession((s) => s.hasHydrated)
  return [{ token, user }, hasHydrated] as const
}
