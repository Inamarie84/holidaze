/**
 * Scoped helper for the Holidaze API paths.
 * Automatically prefixes `/holidaze`, includes API key, and will unwrap `.data`
 * unless `unwrapData: false` is sent.
 */
import { api, type ApiOpts } from '@/lib/api'

type Opts = Pick<ApiOpts, 'method' | 'token' | 'body' | 'unwrapData'>

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
    unwrapData: opts.unwrapData,
  })
}
