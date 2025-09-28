'use client'

import Link from 'next/link'
import Image from 'next/image'

/**
 * Left-side brand lockup used in the navbar.
 *
 * Accessibility note:
 * - The link already has an accessible name via aria-label ("Holidaze home").
 * - Therefore the logo image is purely decorative and should be ignored by screen readers.
 *   Use alt="" per WCAG 2.x SC 1.1.1 (Non-text Content) to avoid redundant announcements.
 * - Do NOT include extra screen-reader-only text that repeats the name; that reintroduces duplication.
 */
export default function NavbarLogo() {
  return (
    <div className="flex items-center justify-between md:justify-start">
      <Link
        href="/"
        className="flex items-center gap-2 shrink-0"
        aria-label="Holidaze home"
      >
        <Image
          src="/images/logo.svg"
          alt="" // decorative image: empty alt is intentional to prevent duplicate name
          width={120}
          height={32}
          priority
        />
      </Link>
    </div>
  )
}
