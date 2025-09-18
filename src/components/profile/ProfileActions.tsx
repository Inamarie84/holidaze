// src/components/profile/ProfileActions.tsx
'use client'

import Link from 'next/link'

export default function ProfileActions({
  role,
}: {
  role: 'manager' | 'customer'
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <Link
        href="/venues"
        className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-black/5"
      >
        Browse venues
      </Link>
      {/* Intentionally no "Create venue" here to prevent duplicate CTA on profile */}
    </div>
  )
}
