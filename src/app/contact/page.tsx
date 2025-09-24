// src/app/contact/page.tsx
import { Suspense } from 'react'
import ContactForm from '@/components/contact/ContactForm'

export const metadata = { title: 'Contact — Holidaze' }

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="h1 mb-4">Contact</h1>
      <p className="body mb-4">
        Got a question about a booking or your venue? Reach us at{' '}
        <a href="mailto:support@holidaze.example" className="underline">
          support@holidaze.example
        </a>{' '}
        or call{' '}
        <a href="tel:+4740404040" className="underline">
          +47 40 40 40 40
        </a>
        .
      </p>

      {/* Wrap in Suspense to satisfy Next’s CSR bailout rule if any descendant ever uses useSearchParams */}
      <Suspense fallback={null}>
        <ContactForm />
      </Suspense>
    </main>
  )
}
