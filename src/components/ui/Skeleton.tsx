//app/components/ui/Skeleton.tsx

'use client'

import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = HTMLAttributes<HTMLDivElement> & {
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export default function Skeleton({
  className,
  rounded = 'md',
  ...rest
}: Props) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'animate-pulse bg-black/10',
        {
          'rounded-sm': rounded === 'sm',
          'rounded-md': rounded === 'md',
          'rounded-lg': rounded === 'lg',
          'rounded-xl': rounded === 'xl',
          'rounded-full': rounded === 'full',
        },
        className
      )}
      {...rest}
    />
  )
}
