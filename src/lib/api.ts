// src/lib/api.ts
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''
const BASE = RAW_BASE.replace(/\/+$/, '')

type Opts = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string | null
  useApiKey?: boolean
  // You can pass additional fetch options if needed (optional)
  // next?: RequestInit['next']
  // cache?: RequestInit['cache']
}

/**
 * Generic API wrapper for the Noroff v2 API (and Holidaze sub-routes).
 * - Throws an Error with { status, body, url, method } on non-OK responses
 * - Parses JSON safely (falls back to text if not JSON)
 * - Returns `json.data` if present; otherwise returns the whole parsed JSON
 */
export async function api<T>(path: string, opts: Opts = {}): Promise<T> {
  if (!BASE) throw new Error('Missing NEXT_PUBLIC_API_URL')

  const headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')

  if (opts.token) headers.set('Authorization', `Bearer ${opts.token}`)
  if (opts.useApiKey && process.env.NEXT_PUBLIC_API_KEY) {
    headers.set('X-Noroff-API-Key', process.env.NEXT_PUBLIC_API_KEY)
  }

  // Ensure exactly one slash between BASE and path
  const url = `${BASE}${path.startsWith('/') ? path : `/${path}`}`

  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
    // ...(opts.next ? { next: opts.next } : {}),
  })

  // Read body once; try JSON, fall back to text
  const rawText = await res.text()
  let parsed: any = null
  try {
    parsed = rawText ? JSON.parse(rawText) : null
  } catch {
    parsed = null
  }

  if (!res.ok) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[api error]', {
        url,
        method: opts.method ?? 'GET',
        status: res.status,
        body: parsed ?? rawText,
      })
    }

    const firstErrorMsg =
      parsed?.errors?.[0]?.message ||
      parsed?.errors?.[0] || // sometimes APIs put strings here
      parsed?.message ||
      parsed?.status ||
      `${res.status} ${res.statusText}`

    const err: any = new Error(
      typeof firstErrorMsg === 'string' ? firstErrorMsg : 'Request failed'
    )
    err.status = res.status
    err.body = parsed ?? rawText
    err.url = url
    err.method = opts.method ?? 'GET'
    throw err
  }

  // No content (204) or truly empty
  if (res.status === 204 || (!rawText && parsed == null)) {
    return undefined as unknown as T
  }

  // Prefer `data` envelope if present, otherwise the whole JSON
  return (parsed && parsed.data ? parsed.data : parsed) as T
}
