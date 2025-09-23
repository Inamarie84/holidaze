// src/components/home/SearchBar.tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useRef } from 'react'
import { Search } from 'lucide-react'
import DateField from '@/components/ui/DateField'
import DestinationField from './search/DestinationField'
import GuestsField from './search/GuestsField'
import { useSearchQuery } from './search/useSearchQuery'

export default function SearchBar() {
  const router = useRouter()
  const sp = useSearchParams()
  const pathname = usePathname()

  const {
    destination,
    setDestination,
    from,
    setFrom,
    to,
    setTo,
    guests,
    setGuests,
    todayYMD,
    submit,
  } = useSearchQuery({ sp, pathname, router })

  // Proper refs for the DateField inputs
  const fromRef = useRef<HTMLInputElement | null>(null)
  const toRef = useRef<HTMLInputElement | null>(null)

  function openPicker(ref: React.RefObject<HTMLInputElement | null>) {
    const el = ref.current
    if (!el) return
    if (typeof (el as any).showPicker === 'function') (el as any).showPicker()
    else el.focus()
  }

  return (
    <section className="w-full border-b border-black/10 bg-sand">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          aria-label="Search for a venue"
          className="space-y-3"
        >
          {/* Line 1: Destination (full width) */}
          <DestinationField value={destination} onChange={setDestination} />

          {/* Line 2: Check-in | Check-out | Guests | Search */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_0.6fr_auto]">
            <DateField
              label="Check-in"
              id="from"
              ref={fromRef}
              min={todayYMD}
              value={from}
              onChange={(e) => setFrom((e.target as HTMLInputElement).value)}
              onOpen={() => openPicker(fromRef)}
            />

            <DateField
              label="Check-out"
              id="to"
              ref={toRef}
              min={from || todayYMD}
              value={to}
              onChange={(e) => setTo((e.target as HTMLInputElement).value)}
              onOpen={() => openPicker(toRef)}
            />

            <GuestsField value={guests} onChange={setGuests} />

            <button
              type="submit"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald px-5 py-2.5 text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-emerald/30 cursor-pointer"
              aria-label="Search venues"
            >
              <Search size={18} aria-hidden={true} />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
