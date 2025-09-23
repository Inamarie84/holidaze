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
    if (typeof (el as any).showPicker === 'function') (el as any).showPicker()
    else el.focus()
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <DateField
        label="Check-in"
        id="check-in"
        ref={checkInRef}
        min={minDate}
        value={dateFrom}
        onChange={(e) => onFromChange((e.target as HTMLInputElement).value)}
        onOpen={() => openPicker(checkInRef)}
      />
      <DateField
        label="Check-out"
        id="check-out"
        ref={checkOutRef}
        min={dateFrom || minDate}
        value={dateTo}
        onChange={(e) => onToChange((e.target as HTMLInputElement).value)}
        onOpen={() => openPicker(checkOutRef)}
      />
    </div>
  )
}
