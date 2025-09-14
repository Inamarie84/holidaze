// src/types/api.ts

/** Public image/media used across entities. */
export type TMedia = {
  /** Fully-qualified, publicly accessible URL (required by API). */
  url: string
  /** Optional alt text for accessibility. */
  alt?: string
}

/** Minimal profile shape (extend as needed). */
export type TProfile = {
  name: string
  email: string
  bio?: string
  avatar?: TMedia
  banner?: TMedia
  /** True if the user can create/manage venues. */
  venueManager: boolean
  /** Optional aggregated counts when included by API. */
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

/** Geolocation & address info for a venue. */
export type TVenueLocation = {
  address?: string
  city?: string
  zip?: string
  country?: string
  continent?: string
  lat?: number
  lng?: number
}

/** A venue available for booking. */
export type TVenue = {
  id: string
  name: string
  description?: string
  /** May be empty or omitted on some records. */
  media?: TMedia[]
  price: number
  maxGuests: number
  /** Optional when not present in payloads. */
  rating?: number
  created?: string
  updated?: string
  meta?: TVenueMeta
  location?: TVenueLocation
  /** Present when included via query (_owner=true). */
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
    // Add nested venue/customer if you ever include them
  }>
}

// /** Venue with bookings included when `_bookings=true`. */
// export type TVenueWithBookings = TVenue & {
//   bookings?: TBookingLite[]
// }

/** A single booking. Optional relations appear when requested via query flags. */
export type TBooking = {
  id: string
  dateFrom: string
  dateTo: string
  guests: number
  created?: string
  updated?: string
  /** Present if `_venue=true` in query. */
  venue?: TVenue
  /** Present if `_customer=true` in query. */
  customer?: Pick<TProfile, 'name' | 'email' | 'avatar' | 'banner'>
}

/** Pagination metadata returned on list endpoints. */
export type TListMeta = {
  isFirstPage: boolean
  isLastPage: boolean
  currentPage: number
  previousPage: number | null
  nextPage: number | null
  pageCount: number
  totalCount: number
}

/** Generic list response envelope `{ data: T[], meta }`. */
export type TListResponse<T> = {
  data: T[]
  meta: TListMeta
}

/** Generic single-item response envelope `{ data: T, meta }`. */
export type TItemResponse<T> = {
  data: T
  meta: Record<string, never> | object
}

/** Response returned by `/auth/login`. */
export type TAuthResponse = {
  accessToken: string
  name: string
  email: string
  venueManager?: boolean
}

/** Payload to register a user. */
export type TRegisterInput = {
  name: string
  email: string
  password: string
}

/** Payload to login a user. */
export type TLoginInput = {
  email: string
  password: string
}

/** Payload to create a booking. */
export type TCreateBookingInput = {
  /** ISO date string, e.g. `new Date().toISOString()` */
  dateFrom: string
  /** ISO date string, e.g. `new Date().toISOString()` */
  dateTo: string
  guests: number
  /** The id of the venue to book. */
  venueId: string
}

/** Payload to update a booking (all fields optional). */
export type TUpdateBookingInput = Partial<
  Pick<TCreateBookingInput, 'dateFrom' | 'dateTo' | 'guests'>
>

/** Optional query/include flags for bookings lists. */
export type TBookingInclude = {
  /** Include nested customer object. */
  _customer?: boolean
  /** Include nested venue object. */
  _venue?: boolean
  /** Optional pagination & sorting if you implement them. */
  page?: number
  limit?: number
  sort?: string
}

/** Optional query/include flags for venues lists. */
export type TVenueInclude = {
  /** Include nested owner profile. */
  _owner?: boolean
  /** Include bookings for availability checks. */
  _bookings?: boolean
  /** Optional pagination & sorting if you implement them. */
  page?: number
  limit?: number
  sort?: string
}

/** Search params we read from /venues route. */
export type TVenueSearchParams = {
  q?: string
  dateFrom?: string
  dateTo?: string
  guests?: string
}
