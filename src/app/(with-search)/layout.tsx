import type { ReactNode } from 'react'
import { Suspense } from 'react'
import SearchBar from '@/components/home/SearchBar'

/**
 * Shared layout for pages that include the search bar hero.
 */
export default function WithSearchLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <section className="bg-terracotta">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 py-8 text-center text-brand">
          <h1 className="h1">Find your next stay</h1>
          <p className="mt-3 body text-brand/80">
            Hand-picked venues, easy booking.
          </p>
        </div>
      </section>

      <Suspense fallback={null}>
        <SearchBar />
      </Suspense>

      {children}
    </>
  )
}
