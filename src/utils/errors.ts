// src/utils/errors.ts

/**
 * Extract a human-friendly message from Noroff v2 API errors, fetch/Response,
 * or generic JS errors. Safe to use everywhere.
 */
export function errMsg(e: unknown): string {
  // JS Error objects
  if (e instanceof Error) return e.message

  // Noroff v2 "wrapped" error objects thrown by your api() helper, e.g.:
  // { status: 401, body: { status: 'Unauthorized', statusCode: 401, errors: [{ message: '...' }] } }
  const anyE = e as any
  const body = anyE?.body

  // Noroff body.errors[]
  const noroffErrArray = body?.errors
  if (Array.isArray(noroffErrArray) && noroffErrArray.length > 0) {
    const messages = noroffErrArray
      .map((it: any) => it?.message)
      .filter(Boolean)
      .join(', ')
    if (messages) return humanize(messages, body?.statusCode)
  }

  // Noroff body.status/body.message
  if (body?.message || body?.status) {
    return humanize(String(body.message ?? body.status), body?.statusCode)
  }

  // Flat error shape { message, statusCode }
  if (anyE?.message || anyE?.statusCode) {
    return humanize(String(anyE.message ?? 'Error'), anyE?.statusCode)
  }

  // String error
  if (typeof e === 'string') return e

  // Fallback
  try {
    return JSON.stringify(e)
  } catch {
    return 'Something went wrong'
  }
}

/**
 * Map common Noroff / auth / validation statuses to nicer copy.
 */
function humanize(message: string, statusCode?: number): string {
  const m = message.toLowerCase()

  // Auth
  if (
    statusCode === 401 ||
    m.includes('unauthorized') ||
    m.includes('invalid token')
  ) {
    return 'You’re not authorized. Please log in and try again.'
  }
  if (statusCode === 403 || m.includes('forbidden')) {
    return 'You don’t have permission to perform this action.'
  }

  // Auth: invalid credentials
  if (
    m.includes('invalid email or password') ||
    m.includes('invalid credentials')
  ) {
    return 'Invalid email or password.'
  }

  // Registration: email conflict
  if (
    statusCode === 409 ||
    m.includes('already registered') ||
    m.includes('conflict')
  ) {
    return 'That email is already registered.'
  }

  // Validation
  if (statusCode === 422 || m.includes('validation')) {
    return 'Some fields are invalid. Please check your input.'
  }

  // Not found
  if (statusCode === 404 || m.includes('not found')) {
    return 'Resource not found.'
  }

  // Otherwise return original (capitalized)
  return capitalize(message)
}

function capitalize(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}
