export type MediaField = { id: string; url: string; alt: string }

export type VenueFormValues = {
  name: string
  description: string
  price: number | ''
  maxGuests: number | ''
  media: MediaField[]
  meta: { wifi: boolean; parking: boolean; breakfast: boolean; pets: boolean }
  location: { address: string; city: string; zip: string; country: string }
}
