'use client'

type Props = {
  message?: string | null
  className?: string
}

/**
 * Simple inline form error text.
 * Renders nothing if no message is provided.
 */
export default function FormError({ message, className = '' }: Props) {
  if (!message) return null
  return <p className={`mt-1 text-sm text-red-600 ${className}`}>{message}</p>
}
