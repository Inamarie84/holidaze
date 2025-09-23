import { describe, it, expect } from '@jest/globals' // makes the file a module

// Local copy for testing behavior:
function toQuery(params?: Record<string, unknown>): string {
  if (!params) return ''
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    usp.set(k, String(v))
  })
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

describe('toQuery', () => {
  it('skips empty, keeps 0 and false', () => {
    const qs = toQuery({ a: 'x', b: '', c: undefined, d: 0, e: false })
    expect(qs).toBe('?a=x&d=0&e=false')
  })
})
