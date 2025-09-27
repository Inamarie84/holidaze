'use client'

import { useRef } from 'react'
import { MapPin } from 'lucide-react'

type Props = {
  value: string
  onChange: (v: string) => void
}

/**
 * Destination input with a focusable wrapper to make the whole block clickable.
 */
export default function DestinationField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const focusInput = () => inputRef.current?.focus()

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={focusInput}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && focusInput()}
      className="cursor-pointer rounded-lg border border-black/15 bg-white p-2 transition hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald"
      aria-label="Destination input"
    >
      <label htmlFor="destination" className="body mb-1 block">
        <span className="inline-flex items-center gap-2">
          <MapPin size={16} aria-hidden />
          Destination
        </span>
      </label>
      <input
        ref={inputRef}
        id="destination"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="City, venue name, seaside…"
        className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none"
        autoComplete="off"
        inputMode="text"
      />
    </div>
  )
}
