'use client'

import React from 'react'

type Props = {
  /** Optional id for aria-describedby linkage */
  id?: string
  /** The error text to display (renders nothing if falsy) */
  message?: string | null
  className?: string
}

/**
 * Small accessible inline error message that renders nothing when `message` is falsy.
 */
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
