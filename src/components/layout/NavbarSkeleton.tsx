// src/components/layout/NavbarSkeleton.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { forwardRef } from 'react'

type HeaderProps = React.ComponentPropsWithoutRef<'header'>

const NavbarSkeleton = forwardRef<HTMLElement, HeaderProps>(
  function NavbarSkeleton({ className = '', ...rest }, ref) {
    return (
      <header
        ref={ref}
        aria-hidden
        className={[
          'sticky top-0 z-50',
          'min-h-[var(--nav-height)]',
          'bg-[#1c1c1c] supports-[backdrop-filter]:bg-[#1c1c1cf0] backdrop-blur',
          'border-b border-transparent',
          'text-white',
          className,
        ].join(' ')}
        {...rest}
      >
        <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 py-2 md:py-0 md:h-[var(--nav-height)] md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between md:justify-start">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <Image
                  src="/images/logo.svg"
                  alt="Holidaze"
                  width={120}
                  height={32}
                />
                <span className="sr-only">Holidaze</span>
              </Link>
            </div>
            <div className="ms-auto h-9 w-64 rounded-lg bg-white/10" />
          </div>
        </nav>
      </header>
    )
  }
)

export default NavbarSkeleton
