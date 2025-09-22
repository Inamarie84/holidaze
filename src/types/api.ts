// src/types/api.ts

/** Public image/media used across entities. */
export type TMedia = {
  url: string
  alt?: string
}

/** Minimal profile shape (extend as needed). */
export type TProfile = {
  name: string
  email: string
  bio?: string
  avatar?: TMedia
  banner?: TMedia
  venueManager: boolean
  _count?: {
    venues: number
    bookings: number
  }
}

/** Amenity flags for a venue. */
export type TVenueMeta = {
  wifi?: boolean
  parking?: boolean
  breakfast?: boolean
  pets?: boolean
}

/** Address info for a venue (no geo/continent). */
export type TVenueLocation = {
  address?: string
  city?: string
  zip?: string
  country?: string
}

/** A venue available for booking. */
export type TVenue = {
  id: string
  name: string
  description?: string
  media?: TMedia[]
  price: number
  maxGuests: number
  rating?: number
  created?: string
  updated?: string
  meta?: TVenueMeta
  location?: TVenueLocation
  owner?: Pick<TProfile, 'name' | 'email' | 'avatar' | 'banner'>
}

/** Booking (light shape when embedded under a venue). */
export type TBookingLite = {
  id: string
  dateFrom: string
  dateTo: string
  guests: number
  created?: string
  updated?: string
}

export type TVenueWithBookings = TVenue & {
  bookings: Array<{
    id: string
    dateFrom: string
    dateTo: string
    guests: number
    created: string
    updated: string
  }>
}

export type TBooking = {
  id: string
  dateFrom: string
  dateTo: string
  guests: number
  created?: string
  updated?: string
  venue?: TVenue
  customer?: Pick<TProfile, 'name' | 'email' | 'avatar' | 'banner'>
}

export type TListMeta = {
  isFirstPage: boolean
  isLastPage: boolean
  currentPage: number
  previousPage: number | null
  nextPage: number | null
  pageCount: number
  totalCount: number
}

export type TListResponse<T> = {
  data: T[]
  meta: TListMeta
}

export type TItemResponse<T> = {
  data: T
  meta: Record<string, never> | object
}

export type TAuthResponse = {
  accessToken: string
  name: string
  email: string
  venueManager?: boolean
}

export type TRegisterInput = {
  name: string
  email: string
  password: string
}

export type TLoginInput = {
  email: string
  password: string
}

export type TCreateBookingInput = {
  dateFrom: string
  dateTo: string
  guests: number
  venueId: string
}

export type TUpdateBookingInput = Partial<
  Pick<TCreateBookingInput, 'dateFrom' | 'dateTo' | 'guests'>
>

export type TBookingInclude = {
  _customer?: boolean
  _venue?: boolean
  page?: number
  limit?: number
  sort?: string
}

export type TVenueInclude = {
  _owner?: boolean
  _bookings?: boolean
  page?: number
  limit?: number
  sort?: string
}

export type TVenueSearchParams = {
  q?: string
  dateFrom?: string
  dateTo?: string
  guests?: string
}

export type UpsertVenueInput = {
  name: string
  description?: string
  media?: { url: string; alt?: string }[]
  price: number
  maxGuests: number
  meta?: {
    wifi?: boolean
    parking?: boolean
    breakfast?: boolean
    pets?: boolean
  }
  location?: {
    address?: string
    city?: string
    zip?: string
    country?: string
  }
}
