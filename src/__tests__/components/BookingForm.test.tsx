// src/__tests__/components/BookingForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import BookingForm from '@/components/venue/BookingForm'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))
jest.mock('@/store/session', () => ({
  useSession: () => ({ token: 't', user: { venueManager: false } }),
}))

test('shows error when check-out ≤ check-in', () => {
  render(
    <BookingForm
      venue={{ id: 'v1', name: 'V', price: 100, maxGuests: 2, bookings: [] }}
    />
  )
  fireEvent.change(screen.getByLabelText(/check-in/i), {
    target: { value: '2025-01-10' },
  })
  fireEvent.change(screen.getByLabelText(/check-out/i), {
    target: { value: '2025-01-09' },
  })
  fireEvent.click(screen.getByRole('button', { name: /book now/i }))
  expect(
    screen.getByText(/check-out must be after check-in/i)
  ).toBeInTheDocument()
})
