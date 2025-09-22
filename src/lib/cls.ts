import { twMerge } from 'tailwind-merge'
import clsx, { type ClassValue } from 'clsx'

/** Merge Tailwind classes with conditionals. */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}
