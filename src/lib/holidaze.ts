// src/lib/holidaze.ts
import { api } from '@/lib/api'

type Opts = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  token?: string | null
  body?: unknown
  unwrapData?: boolean // NEW: pass-through
}

export async function holidazeApi<T>(
  path: string,
  opts: Opts = {}
): Promise<T> {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return api<T>(`/holidaze${normalized}`, {
    method: opts.method ?? 'GET',
    token: opts.token ?? undefined,
    useApiKey: true,
    body: opts.body,
    unwrapData: opts.unwrapData, // NEW
  })
}
