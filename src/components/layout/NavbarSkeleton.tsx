// src/components/layout/NavbarSkeleton.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function NavbarSkeleton() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white bg-[var(--color-foreground)] supports-[backdrop-filter]:bg-[var(--color-foreground)]/90 backdrop-blur border-b-0 transition-[box-shadow,border-color]">
      <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 py-2 md:h-16 md:flex-row md:items-center md:justify-between">
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
