/**
 * Tailwind class name combiner with smart conflict resolution.
 * Use this instead of string templates for conditional classes.
 *
 * @example
 * <div className={cn('p-4', isActive && 'bg-emerald', disabled && 'opacity-60')} />
 */
import { twMerge } from 'tailwind-merge'
import clsx, { type ClassValue } from 'clsx'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}
