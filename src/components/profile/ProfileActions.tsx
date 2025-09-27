'use client'

import Link from 'next/link'

/** Small CTA cluster on the profile page. Keep lean to avoid duplication. */
export default function ProfileActions() {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <Link
        href="/venues"
        className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-black/5"
      >
        Browse venues
      </Link>
    </div>
  )
}
