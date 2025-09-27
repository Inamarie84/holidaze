/**
 * Normalized environment values used by services.
 */
const url = process.env.NEXT_PUBLIC_API_URL
if (!url) throw new Error('Missing NEXT_PUBLIC_API_URL in .env.local')

export const ENV = {
  /** Noroff API base without trailing slash. */
  API_URL: url.replace(/\/+$/, ''),
} as const
