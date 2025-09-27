import { Suspense } from 'react'
import SmartBackButton from '@/components/ui/SmartBackButton'
import ContactForm from '@/components/contact/ContactForm'

export const metadata = { title: 'Contact — Holidaze' }

/**
 * Contact page with a simple mailto form.
 * Wrapped in Suspense to play nice if any child uses client-side hooks.
 */
export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <SmartBackButton className="mb-4" fallback="/venues" />

      <h1 className="h1 mb-4">Contact</h1>
      <p className="body mb-4">
        Got a question about a booking or your venue? Reach us at{' '}
        <a href="mailto:support@holidaze.com" className="underline">
          support@holidaze.com
        </a>{' '}
        or call{' '}
        <a href="tel:+4740404040" className="underline">
          +47 40 40 40 40
        </a>
        .
      </p>

      <Suspense fallback={null}>
        <ContactForm />
      </Suspense>
    </section>
  )
}
