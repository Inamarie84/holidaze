'use client'

import { useRef } from 'react'
import { Users } from 'lucide-react'

type Guests = number | ''

export default function GuestsField({
  value,
  onChange,
}: {
  value: Guests
  onChange: (v: Guests) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  function focusInput() {
    const el = inputRef.current
    if (!el) return
    el.focus()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={focusInput}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && focusInput()}
      className="cursor-pointer rounded-lg border border-black/15 bg-white p-2 transition hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald"
    >
      <label htmlFor="guests" className="body mb-1 block">
        <span className="inline-flex items-center gap-2">
          <Users size={16} aria-hidden={true} />
          Guests
        </span>
      </label>
      <input
        ref={inputRef}
        id="guests"
        type="number"
        min={1}
        max={50}
        placeholder="1"
        value={value}
        onChange={(e) => {
          const v = e.target.value
          onChange(v === '' ? '' : Math.max(1, Math.min(50, Number(v))))
        }}
        className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none"
      />
    </div>
  )
}
