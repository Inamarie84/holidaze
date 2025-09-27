'use client'

import { cn } from '@/lib/cls'

/**
 * Base input used across forms.
 * Includes `suppressHydrationWarning` to avoid visual diffs when browser extensions
 * (e.g. password-managers) mutate attributes before React hydrates.
 */
export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      suppressHydrationWarning
      {...props}
      className={cn(
        'w-full rounded-lg border border-black/15 px-3 py-2',
        props.disabled && 'opacity-60',
        className
      )}
    />
  )
}
