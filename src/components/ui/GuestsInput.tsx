'use client'

type GuestsValue = number | ''

type Props = {
  id: string
  label: React.ReactNode
  value: GuestsValue
  onChange: (v: GuestsValue) => void
  min?: number
  max?: number
  required?: boolean
  inputClassName?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

/**
 * Numeric input specialized for selecting guests. Emits `''` when the field is empty.
 */
export default function GuestsInput({
  id,
  label,
  value,
  onChange,
  min = 1,
  max = 50,
  required,
  inputClassName,
  ...aria
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="body mb-1 block">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        required={required}
        value={value}
        onChange={(e) => {
          const raw = e.target.value
          onChange(raw === '' ? '' : Number(raw))
        }}
        className={
          inputClassName ?? 'w-full rounded-lg border border-black/15 px-3 py-2'
        }
        {...aria}
      />
    </div>
  )
}
