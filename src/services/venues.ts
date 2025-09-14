// src/services/venues.ts
import { api } from '@/lib/api'
import type { TVenue, TVenueWithBookings, TVenueInclude } from '@/types/api'

/**
 * Build a query string from optional include/pagination flags.
 * Skips empty/undefined values so the URL stays clean.
 *
 * @param {TVenueInclude} [params] - Optional flags & pagination (e.g. `_bookings`, `_owner`, `page`, `limit`, `sort`).
 * @returns {string} A query string beginning with `?` or an empty string.
 *
 * @example
 * toQuery({ _bookings: true, page: 2, limit: 12 }) // => "?_bookings=true&page=2&limit=12"
 */
function toQuery(params?: TVenueInclude): string {
  if (!params) return ''
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    usp.set(k, String(v))
  })
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

/**
 * Fetch a list of venues.
 * Uses the generic `api<T>()` helper which already unwraps `{ data }` if present.
 *
 * @param {TVenueInclude} [params] - Optional flags & pagination (e.g. `_bookings`, `_owner`, `page`, `limit`, `sort`).
 * @returns {Promise<TVenue[]>} A promise that resolves to an array of venues.
 *
 * @example
 * // Basic list
 * const venues = await getVenues()
 *
 * @example
 * // Include bookings & paginate server-side
 * const venues = await getVenues({ _bookings: true, page: 1, limit: 12 })
 */
export async function getVenues(params?: TVenueInclude): Promise<TVenue[]> {
  const query = toQuery(params)
  return api<TVenue[]>(`/holidaze/venues${query}`)
}

/**
 * Fetch a single venue by its ID.
 *
 * @param {string} id - Venue ID (from the list or route param).
 * @param {TVenueInclude} [params] - Optional flags (e.g. `_bookings`, `_owner`).
 * @returns {Promise<TVenue>} A promise that resolves to the venue object.
 *
 * @example
 * const venue = await getVenueById('abc123', { _bookings: true, _owner: true })
 */
export async function getVenueById(
  id: string,
  params?: TVenueInclude
): Promise<TVenue> {
  const query = toQuery(params)
  return api<TVenue>(`/holidaze/venues/${id}${query}`)
}

/**
 * Input for client-side search when combining multiple filters.
 * All fields are optional; omit what you don't need.
 */
type SearchInput = {
  /** Free-text query (matched against name, description, city, country). */
  q?: string
  /** Inclusive ISO date (YYYY-MM-DD or full ISO) for availability start. */
  dateFrom?: string
  /** Exclusive ISO date for availability end (checkout date). */
  dateTo?: string
  /** Minimum guest count required. */
  guests?: number
}

/**
 * Client-side venue search with availability filtering.
 *
 * This function fetches venues with `_bookings=true` (so we can compute date
 * availability locally), then filters by:
 *  - `q` (case-insensitive match on name/description/location)
 *  - `guests` (maxGuests must be >= required guests)
 *  - date overlap (excludes venues with bookings overlapping [dateFrom, dateTo))
 *
 * Use this when you need instant feedback while typing or combining filters
 * that the API doesn't support directly as query params.
 *
 * @param {SearchInput} input - Search/filter parameters.
 * @returns {Promise<TVenueWithBookings[]>} A filtered list of venues with bookings included.
 *
 * @example
 * const results = await searchVenues({
 *   q: 'Bergen',
 *   dateFrom: '2025-09-22',
 *   dateTo: '2025-09-25',
 *   guests: 3,
 * })
 */
export async function searchVenues({
  q,
  dateFrom,
  dateTo,
  guests,
}: SearchInput): Promise<TVenueWithBookings[]> {
  // Include bookings so we can filter by availability on the client
  const venues = await api<TVenueWithBookings[]>(
    '/holidaze/venues?_bookings=true'
  )

  const norm = (s: unknown) =>
    String(s ?? '')
      .toLowerCase()
      .trim()
  const from = dateFrom ? new Date(dateFrom) : null
  const to = dateTo ? new Date(dateTo) : null

  /**
   * Check if the desired date range [from, to) overlaps an existing booking [bFrom, bTo).
   * We treat `to` as exclusive, so checking out on the same day another booking starts is allowed.
   *
   * @param {Date} bFrom - Booking start date.
   * @param {Date} bTo - Booking end date.
   * @returns {boolean} True if ranges overlap.
   */
  const overlaps = (bFrom: Date, bTo: Date) => {
    if (!from || !to) return false
    // overlap exists unless one range ends before the other starts
    return !(to <= bFrom || from >= bTo)
  }

  return venues.filter((v) => {
    // q filter: name / description / city / country
    if (q) {
      const needle = norm(q)
      const hay = `${norm(v.name)} ${norm(v.description)} ${norm(
        v.location?.city
      )} ${norm(v.location?.country)}`
      if (!hay.includes(needle)) return false
    }

    // guests filter
    if (guests && v.maxGuests < guests) return false

    // availability filter (if dates set, ensure no overlapping bookings)
    if (from && to) {
      const hasOverlap = (v.bookings ?? []).some((b) =>
        overlaps(new Date(b.dateFrom), new Date(b.dateTo))
      )
      if (hasOverlap) return false
    }

    return true
  })
}
