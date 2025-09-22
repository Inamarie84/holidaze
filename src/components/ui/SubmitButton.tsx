'use client'
import { cn } from '@/lib/cls'

/** Consistent submit button with busy state. */
export function SubmitButton({
  busy,
  children,
  className,
}: {
  busy?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      aria-busy={busy}
      className={cn(
        'inline-flex items-center justify-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60',
        className
      )}
    >
      {children}
    </button>
  )
}
