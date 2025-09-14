// src/app/(with-search)/layout.tsx
import type { ReactNode } from 'react'
import SearchBar from '@/components/home/SearchBar'

export default function WithSearchLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-foreground)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
          <h1 className="h1 text-white">Find your next stay</h1>
          <h2 className="body mt-3 opacity-90">
            Hand-picked venues, easy booking.
          </h2>
        </div>
      </section>

      {/* Global search bar (appears on all pages inside this group) */}
      <SearchBar />

      {/* Page content */}
      {children}
    </>
  )
}
