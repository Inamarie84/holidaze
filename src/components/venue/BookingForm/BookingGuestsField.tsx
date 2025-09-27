'use client'

import GuestsInput from '@/components/ui/GuestsInput'
import FormError from '@/components/ui/FormError'

type Props = {
  maxGuests: number
  value: number
  onChange: (n: number) => void
  error: string | null
}

/**
 * Guests field with max guard and accessible inline error.
 */
export default function BookingGuestsField({
  maxGuests,
  value,
  onChange,
  error,
}: Props) {
  return (
    <div>
      <GuestsInput
        id="guests"
        label={`Guests (max ${maxGuests})`}
        value={value}
        onChange={(v) => onChange((v as number) || 1)}
        min={1}
        max={maxGuests}
        required
        aria-invalid={!!error}
        aria-describedby={error ? 'guest-error' : undefined}
      />
      <FormError id="guest-error" message={error} />
    </div>
  )
}
