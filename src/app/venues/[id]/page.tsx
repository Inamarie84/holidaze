import VenueDetailsPageClient from './VenueDetailsPageClient'

type PageProps = { params: Promise<{ id: string }> }
export const dynamic = 'force-dynamic'

const Page = async ({ params }: PageProps) => {
  const { id } = await params
  return <VenueDetailsPageClient id={id} />
}
export default Page
