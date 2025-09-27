'use client'

import Link from 'next/link'
import Image from 'next/image'

/** Left-side brand lockup used in the navbar. */
export default function NavbarLogo() {
  return (
    <div className="flex items-center justify-between md:justify-start">
      <Link
        href="/"
        className="flex items-center gap-2 shrink-0"
        aria-label="Holidaze home"
      >
        <Image src="/images/logo.svg" alt="Holidaze" width={120} height={32} />
        <span className="sr-only">Holidaze</span>
      </Link>
    </div>
  )
}
