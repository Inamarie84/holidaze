'use client'

import type { ReactNode } from 'react'

type Props = {
  label: string
  children: ReactNode
  /** Only show the tooltip on very small screens (where text is hidden). Default: true */
  smallOnly?: boolean
}

export default function IconHint({ label, children, smallOnly = true }: Props) {
  // We use a <span> as tooltip that appears on hover/focus of the wrapped control.
  // "group" and "group-focus-within" let it work with both links and buttons.
  return (
    <div
      className={[
        'relative inline-flex items-center group',
        smallOnly ? 'max-[430px]:inline-flex' : 'inline-flex',
      ].join(' ')}
    >
      {children}
      <span
        role="tooltip"
        className={[
          // hidden by default
          'pointer-events-none absolute top-full left-1/2 z-50 hidden -translate-x-1/2 translate-y-1',
          // show on hover or keyboard focus of the child
          'group-hover:block group-focus-within:block',
          // style
          'whitespace-nowrap rounded-md bg-black/85 px-2 py-1 text-xs text-white shadow',
          // only render on very small screens if smallOnly
          smallOnly ? 'max-[430px]:block' : 'block',
        ].join(' ')}
      >
        {label}
      </span>
    </div>
  )
}
