// src/components/ui/FormError.tsx
'use client'

import React from 'react'

/**
 * Small accessible inline error message.
 * - Renders nothing when `message` is falsy
 * - Supports `id` so inputs can reference via `aria-describedby`
 */
type Props = {
  /** Optional id for aria-describedby linkage */
  id?: string
  /** The error text to display (renders nothing if falsy) */
  message?: string | null
  /** Extra classes if needed */
  className?: string
}

export default function FormError({ id, message, className = '' }: Props) {
  if (!message) return null
  return (
    <p
      id={id}
      role="alert"
      aria-live="polite"
      className={`mt-1 text-sm text-red-600 ${className}`}
    >
      {message}
    </p>
  )
}
