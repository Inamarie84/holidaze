type Props = { params: Promise<{ id: string }> }

export default async function Head(_props: Props) {
  // Static title/description for edit page (no need to fetch)
  const title = 'Edit venue • Holidaze'
  const description = 'Update your venue details'
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
