'use client'
import { cn } from '@/lib/cls'

/** Base input used across forms. */
export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-lg border border-black/15 px-3 py-2',
        props.disabled && 'opacity-60',
        className
      )}
    />
  )
}
