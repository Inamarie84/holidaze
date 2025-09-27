// app/venues/[id]/edit/head.tsx
export default function Head() {
  const title = 'Edit venue • Holidaze'
  const description = 'Update your venue details'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* Do NOT add favicon here; it's already in the root layout */}
    </>
  )
}
