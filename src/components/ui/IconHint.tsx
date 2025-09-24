'use client'

import type { ReactNode } from 'react'

type Props = {
  label: string
  children: ReactNode
  /** Show tooltip only on very small screens (<=430px). Default: true */
  smallOnly?: boolean
}

export default function IconHint({ label, children, smallOnly = true }: Props) {
  // Wrapper must be a .group so hover/focus on the child triggers the tooltip
  return (
    <div className="relative inline-flex items-center group">
      {children}
      <span
        role="tooltip"
        className={[
          // hidden by default
          'pointer-events-none absolute top-full left-1/2 z-50 hidden -translate-x-1/2 translate-y-1',
          'whitespace-nowrap rounded-md bg-black/85 px-2 py-1 text-xs text-white shadow',
          // show rules:
          smallOnly
            ? // only on very small screens, and only on hover/focus
              'max-[430px]:group-hover:block max-[430px]:group-focus-within:block'
            : // on all screens, but still only on hover/focus
              'group-hover:block group-focus-within:block',
        ].join(' ')}
      >
        {label}
      </span>
    </div>
  )
}
