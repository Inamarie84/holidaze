'use client'

import { cn } from '@/lib/cls'

/**
 * Accessible form field wrapper connecting label, input, and optional error text.
 */
export function FormField({
  id,
  label,
  children,
  error,
  className,
}: {
  id: string
  label: string
  children: React.ReactNode
  error?: string | null
  className?: string
}) {
  const describedBy = error ? `${id}-error` : undefined
  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={id} className="body block">
        {label}
      </label>
      {children}
      {error && (
        <p id={describedBy} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
