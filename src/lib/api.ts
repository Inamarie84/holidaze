// src/lib/api.ts
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''
const BASE = RAW_BASE.replace(/\/+$/, '') // trim trailing slashes

type Opts = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string | null
  useApiKey?: boolean // opt-in for endpoints that require X-Noroff-API-Key
}

/**
 * Call the Holidaze API with JSON conventions.
 */
export async function api<T>(path: string, opts: Opts = {}): Promise<T> {
  if (!BASE) throw new Error('Missing NEXT_PUBLIC_API_URL')

  const headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')

  if (opts.token) {
    headers.set('Authorization', `Bearer ${opts.token}`)
  }
  if (opts.useApiKey && process.env.NEXT_PUBLIC_API_KEY) {
    headers.set('X-Noroff-API-Key', process.env.NEXT_PUBLIC_API_KEY)
  }

  const url = `${BASE}${path.startsWith('/') ? path : `/${path}`}`

  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
  })

  const text = await res.text()
  const json = text ? JSON.parse(text) : null

  if (!res.ok) {
    const msg =
      (json && (json.message || json.errors?.[0])) ||
      `${res.status} ${res.statusText}`
    throw new Error(msg)
  }

  // Unwrap { data } if present
  return json && json.data ? (json.data as T) : (json as T)
}
