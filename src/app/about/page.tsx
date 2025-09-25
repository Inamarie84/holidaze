import SmartBackButton from '@/components/ui/SmartBackButton'

export const metadata = { title: 'About — Holidaze' }

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <SmartBackButton className="mb-4" fallback="/venues" />

      <h1 className="h1 mb-4">About Holidaze</h1>
      <p className="body mb-4">
        Holidaze is a modern booking platform connecting travelers with unique
        places to stay. It’s built on the Noroff Holidaze API and focuses on a
        clean, fast, accessible user experience.
      </p>
      <p className="body mb-4">
        <strong>For customers:</strong> search by destination and dates, check
        availability at a glance, and book in just a few clicks. Manage your
        upcoming and past bookings from your profile and keep your avatar up to
        date.
      </p>
      <p className="body">
        <strong>For venue managers:</strong> create and edit venue listings,
        upload photos, set amenities, and monitor upcoming bookings for your
        properties — all from one place.
      </p>
    </section>
  )
}
