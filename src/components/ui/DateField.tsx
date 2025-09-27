'use client'
import { forwardRef } from 'react'

type Props = React.ComponentProps<'input'> & {
  label: string
  id: string
  onOpen?: () => void
}

/** Labeled date input. Container click can open the native picker. */
const DateField = forwardRef<HTMLInputElement, Props>(
  ({ label, id, onOpen, className = '', ...rest }, ref) => (
    <div
      onClick={onOpen}
      className="min-w-0 cursor-pointer rounded-lg border border-black/15 bg-white p-2 transition hover:bg-black/5 focus-within:ring-2 focus-within:ring-emerald"
    >
      <label htmlFor={id} className="body mb-1 block">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        type="date"
        className={`input-date w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none ${className}`}
        {...rest}
      />
    </div>
  )
)

DateField.displayName = 'DateField'
export default DateField
