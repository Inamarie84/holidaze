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
      {/* Hero (no extra pt-16 here—root <main> already adds it) */}
      <section className="bg-terracotta">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 py-8 text-center text-white">
          <h1 className="h1 text-white">Find your next stay</h1>
          <p className="mt-3 text-base text-white/80">
            Hand-picked venues, easy booking.
          </p>
        </div>
      </section>

      {/* Global search bar (appears on all pages inside this group) */}
      <SearchBar />

      {/* Page content */}
      {children}
    </>
  )
}
