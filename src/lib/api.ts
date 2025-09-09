// src/lib/api.ts
const BASE = (process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/+$/, '')
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? ''

type Opts = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string | null // JWT from /auth/login
  useApiKey?: boolean // set true for profiles endpoints
  cache?: RequestCache
}

export async function api<T>(path: string, opts: Opts = {}): Promise<T> {
  if (!BASE) throw new Error('Missing NEXT_PUBLIC_BASE_URL')

  const headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')

  if (opts.token) headers.set('Authorization', `Bearer ${opts.token}`)
  // Only attach the Noroff key when requested (profiles)
  if (opts.useApiKey && API_KEY) headers.set('X-Noroff-API-Key', API_KEY)

  const url = `${BASE}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: opts.cache ?? 'no-store',
  })

  // Try to parse JSON, but don’t crash on empty body
  const text = await res.text()
  const data = text ? safeJson(text) : null

  if (!res.ok) {
    const msg =
      (data && (data.message || (data.errors && data.errors[0]))) ||
      `${res.status} ${res.statusText}`
    throw new Error(String(msg))
  }

  // Noroff v2 returns { data, meta }
  return data && typeof data === 'object' && 'data' in (data as any)
    ? ((data as any).data as T)
    : (data as T)
}

function safeJson(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
