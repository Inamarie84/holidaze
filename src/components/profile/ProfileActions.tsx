// src/components/profile/ProfileActions.tsx
'use client'

type Props = { role: 'customer' | 'manager' }

export default function ProfileActions({ role }: Props) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {role === 'manager' ? (
        <>
          <a
            href="/venues/new"
            className="inline-flex items-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90 cursor-pointer"
          >
            Create Venue
          </a>
          <a
            href="/"
            className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-black/5 cursor-pointer"
          >
            Browse Venues
          </a>
        </>
      ) : (
        <a
          href="/"
          className="inline-flex items-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90 cursor-pointer"
        >
          Browse Venues
        </a>
      )}
    </div>
  )
}
