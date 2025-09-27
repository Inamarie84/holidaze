'use client'

import { useRef } from 'react'
import DateField from '@/components/ui/DateField'

type Props = {
  /** Selected check-in (yyyy-mm-dd) */
  dateFrom: string
  /** Selected check-out (yyyy-mm-dd) */
  dateTo: string
  /** Minimum selectable date (yyyy-mm-dd) */
  minDate: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
}

type InputWithPicker = HTMLInputElement & { showPicker?: () => void }

/**
 * Two date inputs (Check-in / Check-out) that also open the native picker
 * when their containers are clicked/activated.
 */
export default function BookingDates({
  dateFrom,
  dateTo,
  minDate,
  onFromChange,
  onToChange,
}: Props) {
  const inRef = useRef<HTMLInputElement | null>(null)
  const outRef = useRef<HTMLInputElement | null>(null)

  function openPicker(ref: React.RefObject<HTMLInputElement | null>) {
    const el = ref.current as InputWithPicker | null
    if (!el) return
    if (typeof el.showPicker === 'function') el.showPicker()
    else el.focus()
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <DateField
        label="Check-in"
        id="check-in"
        ref={inRef}
        min={minDate}
        value={dateFrom}
        onChange={(e) => onFromChange(e.target.value)}
        onOpen={() => openPicker(inRef)}
      />
      <DateField
        label="Check-out"
        id="check-out"
        ref={outRef}
        min={dateFrom || minDate}
        value={dateTo}
        onChange={(e) => onToChange(e.target.value)}
        onOpen={() => openPicker(outRef)}
      />
    </div>
  )
}
