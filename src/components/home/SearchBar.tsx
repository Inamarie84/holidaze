'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useRef } from 'react'
import { Search } from 'lucide-react'
import DateField from '@/components/ui/DateField'
import DestinationField from './search/DestinationField'
import GuestsField from './search/SearchGuestsField'
import { useSearchQuery } from './search/useSearchQuery'

/** Native input that *may* expose the date picker API. */
type InputWithPicker = HTMLInputElement & { showPicker?: () => void }

/**
 * Top search bar: destination + dates + guests + submit.
 * Syncs with the URL (venues index) and pushes on submit elsewhere.
 */
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

  const fromRef = useRef<HTMLInputElement | null>(null)
  const toRef = useRef<HTMLInputElement | null>(null)

  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const el = ref.current as InputWithPicker | null
    if (!el) return
    if (typeof el.showPicker === 'function') el.showPicker()
    else el.focus()
  }

  return (
    <div className="w-full border-b border-black/10 bg-sand">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          aria-label="Search for a venue"
          className="space-y-3"
          noValidate
        >
          {/* Line 1: Destination (full width) */}
          <DestinationField value={destination} onChange={setDestination} />

          {/* Line 2: Check-in | Check-out | Guests | Search */}
          <div className="grid grid-cols-1 gap-3 sm:[grid-template-columns:1fr_1fr_minmax(8rem,.7fr)_auto] sm:gap-2">
            <DateField
              label="Check-in"
              id="from"
              ref={fromRef}
              min={todayYMD}
              value={from}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFrom(e.target.value)
              }
              onOpen={() => openPicker(fromRef)}
            />

            <DateField
              label="Check-out"
              id="to"
              ref={toRef}
              min={from || todayYMD}
              value={to}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTo(e.target.value)
              }
              onOpen={() => openPicker(toRef)}
            />

            <GuestsField value={guests} onChange={setGuests} />

            <button
              type="submit"
              className="min-w-0 mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald px-4 py-2.5 text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-emerald/30 justify-self-stretch sm:justify-self-end cursor-pointer"
              aria-label="Search venues"
            >
              <Search size={18} aria-hidden />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
