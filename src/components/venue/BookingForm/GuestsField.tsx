'use client'

import FormError from '@/components/ui/FormError'

type Props = {
  maxGuests: number
  value: number
  onChange: (n: number) => void
  error: string | null
}

export default function GuestsField({
  maxGuests,
  value,
  onChange,
  error,
}: Props) {
  return (
    <div>
      <label className="body mb-1 block" htmlFor="guests">
        {`Guests (max ${maxGuests})`}
      </label>
      <input
        id="guests"
        type="number"
        min={1}
        max={maxGuests}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-black/15 px-3 py-2"
        required
        aria-invalid={!!error}
        aria-describedby={error ? 'guest-error' : undefined}
      />
      <FormError id="guest-error" message={error} />
    </div>
  )
}
