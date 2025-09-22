// src/lib/holidaze.ts
import { api } from '@/lib/api'

type Opts = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string | null
}

export function holidazeApi<T>(path: string, opts: Opts = {}) {
  // Always send API key for Holidaze sub-routes
  return api<T>(`/holidaze${path}`, { ...opts, useApiKey: true })
}
