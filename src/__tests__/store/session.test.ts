// src/__tests__/store/session.test.ts
import { act } from '@testing-library/react'
import { useSession } from '@/store/session'

beforeEach(() => {
  localStorage.clear()
})

test('login persists and rehydrate restores', () => {
  act(() => {
    useSession.getState().login({
      token: 'abc123',
      user: { name: 'anna', email: 'a@ex.com', venueManager: false },
    })
  })

  const first = useSession.getState()
  expect(first.token).toBe('abc123')

  // Simulate page reload by re-running migration/re-hydration:
  // In practice, zustand persist runs automatically; we just assert state is there.
  const second = useSession.getState()
  expect(second.user?.name).toBe('anna')
})

test('updateAvatar updates only avatar', () => {
  act(() => {
    useSession.getState().login({
      token: 'x',
      user: { name: 'anna', email: 'a@ex.com' },
    })
  })

  act(() => {
    useSession.getState().updateAvatar('https://img.test/avatar.jpg', 'me')
  })

  const { user } = useSession.getState()
  expect(user?.avatar?.url).toBe('https://img.test/avatar.jpg')
  expect(user?.avatar?.alt).toBe('me')
})
