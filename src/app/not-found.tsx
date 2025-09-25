import Link from 'next/link'

export const metadata = { title: 'Page not found — Holidaze' }

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="h1 mb-3">Page not found</h1>
      <p className="body mb-6">
        Sorry, we couldn’t find that page. It might have been moved or deleted.
      </p>

      <div className="flex gap-3">
        <Link
          href="/venues"
          className="inline-flex items-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90"
        >
          Browse venues
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-black/5"
        >
          Go home
        </Link>
      </div>
    </section>
  )
}
