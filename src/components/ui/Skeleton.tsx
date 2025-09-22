'use client'

import { cn } from '@/lib/cls'

/**
 * Generic skeleton block. Use width/height via className.
 */
export default function Skeleton({
  className,
  rounded,
}: {
  className?: string
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | 'full'
}) {
  const r =
    rounded === 'full'
      ? 'rounded-full'
      : rounded
        ? `rounded-${rounded}`
        : 'rounded-md'
  return <div className={cn('animate-pulse bg-gray-200', r, className)} />
}
