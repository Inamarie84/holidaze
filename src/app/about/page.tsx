export const metadata = { title: 'About — Holidaze' }

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="h1 mb-4">About Holidaze</h1>
      <p className="body mb-4">
        Holidaze helps travelers discover unique stays and book them with ease.
        Venue managers can list, edit, and manage availability all in one place.
      </p>
      <p className="body">
        This project is a front-end built against the official Noroff API as
        part of a coursework brief. Design and UX choices are custom, while core
        features follow the spec.
      </p>
    </main>
  )
}
