// src/components/venue/BookingForm/BookingDates.tsx
'use client'

import { useRef } from 'react'
import DateField from '@/components/ui/DateField'

type Props = {
  dateFrom: string
  dateTo: string
  minDate: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
}

type WithShowPicker = HTMLInputElement & { showPicker?: () => void }

/** Two date inputs (Check-in / Check-out) with native-picker open on container click. */
export default function BookingDates({
  dateFrom,
  dateTo,
  minDate,
  onFromChange,
  onToChange,
}: Props) {
  const checkInRef = useRef<HTMLInputElement | null>(null)
  const checkOutRef = useRef<HTMLInputElement | null>(null)

  function openPicker(ref: React.RefObject<HTMLInputElement | null>) {
    const el = ref.current
    if (!el) return
    const maybe = el as WithShowPicker
    if ('showPicker' in maybe && typeof maybe.showPicker === 'function') {
      maybe.showPicker()
    } else {
      el.focus()
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <DateField
        label="Check-in"
        id="check-in"
        ref={checkInRef}
        min={minDate}
        value={dateFrom}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onFromChange(e.target.value)
        }
        onOpen={() => openPicker(checkInRef)}
      />
      <DateField
        label="Check-out"
        id="check-out"
        ref={checkOutRef}
        min={dateFrom || minDate}
        value={dateTo}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onToChange(e.target.value)
        }
        onOpen={() => openPicker(checkOutRef)}
      />
    </div>
  )
}
