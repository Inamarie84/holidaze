// src/components/profile/ProfileActions.tsx
'use client'

import Link from 'next/link'

export default function ProfileActions() {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <Link
        href="/venues"
        className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-black/5"
      >
        Browse venues
      </Link>
      {/* Keep this lean to avoid duplicating CTAs already in the navbar/profile header */}
    </div>
  )
}
