/**
 * Generic API wrapper for the Noroff v2 API (and sub-routes).
 * - Adds JSON headers, optional Bearer token and API key
 * - Ensures a single slash between base and path
 * - Parses response safely (JSON -> fallback text)
 * - Throws an Error with { status, body, url, method } on non-OK
 * - By default returns `json.data` if present; set `unwrapData: false` to get the raw JSON
 */
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''
const BASE = RAW_BASE.replace(/\/+$/, '')

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type ApiOpts = {
  method?: HttpMethod
  body?: unknown
  token?: string | null
  useApiKey?: boolean
  /** When false, return full parsed JSON (don’t auto-unwrap .data). Defaults to true. */
  unwrapData?: boolean
  /** Pass-through init if you ever need it; currently unused. */
  // next?: RequestInit['next']
  // cache?: RequestInit['cache']
}

export type ApiError = Error & {
  status: number
  body: unknown
  url: string
  method: string
}

export async function api<T>(path: string, opts: ApiOpts = {}): Promise<T> {
  if (!BASE) throw new Error('Missing NEXT_PUBLIC_API_URL')

  const headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')

  if (opts.token) headers.set('Authorization', `Bearer ${opts.token}`)
  if (opts.useApiKey && process.env.NEXT_PUBLIC_API_KEY) {
    headers.set('X-Noroff-API-Key', process.env.NEXT_PUBLIC_API_KEY)
  }

  const url = `${BASE}${path.startsWith('/') ? path : `/${path}`}`

  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
    // ...(opts.next ? { next: opts.next } : {}),
  })

  // Read once; try JSON, fall back to text
  const rawText = await res.text()
  let parsed: unknown = null
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

    const p = parsed as {
      errors?: Array<{ message?: string } | string>
      message?: string
      status?: string
    } | null

    const firstErrorMsg =
      p?.errors?.[0] && typeof p.errors[0] === 'object'
        ? p.errors[0]?.message
        : typeof p?.errors?.[0] === 'string'
          ? p.errors[0]
          : p?.message || p?.status || `${res.status} ${res.statusText}`

    const err = new Error(
      typeof firstErrorMsg === 'string' ? firstErrorMsg : 'Request failed'
    ) as ApiError
    err.status = res.status
    err.body = parsed ?? rawText
    err.url = url
    err.method = opts.method ?? 'GET'
    throw err
  }

  // No content
  if (res.status === 204 || (!rawText && parsed == null)) {
    return undefined as unknown as T
  }

  const shouldUnwrap = opts.unwrapData !== false
  if (
    shouldUnwrap &&
    parsed &&
    typeof parsed === 'object' &&
    'data' in (parsed as Record<string, unknown>)
  ) {
    return (parsed as { data: T }).data
  }

  return parsed as T
}
