'use client'

import { useRef } from 'react'
import { Users } from 'lucide-react'
import GuestsInput from '@/components/ui/GuestsInput'

type Guests = number | ''

export default function SearchGuestsField({
  value,
  onChange,
}: {
  value: Guests
  onChange: (v: Guests) => void
}) {
  const ref = useRef<HTMLInputElement | null>(null)

  const focusInput = () => ref.current?.focus()

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={focusInput}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && focusInput()}
      className="cursor-pointer rounded-lg border border-black/15 bg-white p-2 transition hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald"
    >
      <GuestsInput
        id="guests"
        label={
          <span className="inline-flex items-center gap-2">
            <Users size={16} aria-hidden />
            Guests
          </span>
        }
        value={value}
        onChange={onChange}
        min={1}
        max={50}
        // pass the ref to the input
        inputClassName="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none"
        // @ts-expect-error: ref passthrough via any (quick approach)
        ref={ref}
      />
    </div>
  )
}
