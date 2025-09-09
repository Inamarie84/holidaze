export default function Home() {
  return (
    <main>
      <section className="bg-[#1c1c1c] py-16 text-center">
        <h1 className="h1">Hello Holidaze</h1> {/* should be white */}
        <p className="body mt-3">Plan your next stay.</p>{' '}
        {/* matte black elsewhere */}
      </section>

      <section className="py-16 text-center">
        <h2 className="h2">Featured Venues</h2>
        <p className="body mt-3">
          Discover our hand-picked selection of stays.
        </p>
      </section>
    </main>
  )
}
