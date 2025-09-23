//src/lib/env.ts

const url = process.env.NEXT_PUBLIC_API_URL
if (!url) throw new Error('Missing NEXT_PUBLIC_API_URL in .env.local')

export const ENV = {
  API_URL: url.replace(/\/+$/, ''), // strip trailing slash
} as const
