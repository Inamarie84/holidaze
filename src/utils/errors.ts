// src/utils/errors.ts

/**
 * Extract a human-friendly message from Noroff v2 API errors, our api() throws,
 * fetch/Response shapes, or generic JS errors. Safe to use everywhere.
 */
export function errMsg(e: unknown): string {
  // Standard JS Error
  if (e instanceof Error && e.message) return e.message

  const anyE = e as any
  const body = anyE?.body

  // Noroff { body: { errors: [{ message }] } }
  const noroffErrs = body?.errors
  if (Array.isArray(noroffErrs) && noroffErrs.length > 0) {
    const messages = noroffErrs
      .map((it: any) => (typeof it === 'string' ? it : it?.message))
      .filter(Boolean)
      .join(', ')
    if (messages) return humanize(messages, body?.statusCode)
  }

  // Noroff { body: { message, status, statusCode } }
  if (body?.message || body?.status) {
    return humanize(String(body.message ?? body.status), body?.statusCode)
  }

  // Flat error shapes { message, statusCode }
  if (
    typeof anyE?.message === 'string' ||
    typeof anyE?.statusCode === 'number'
  ) {
    return humanize(String(anyE.message ?? 'Error'), anyE?.statusCode)
  }

  // Plain string
  if (typeof e === 'string') return e

  // Fallback to JSON
  try {
    return JSON.stringify(e)
  } catch {
    return 'Something went wrong'
  }
}

/**
 * Map common statuses/phrases to friendlier copy.
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

  // Invalid credentials
  if (
    m.includes('invalid email or password') ||
    m.includes('invalid credentials')
  ) {
    return 'Invalid email or password.'
  }

  // Registration conflicts
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

  // Otherwise keep original (capitalized)
  return capitalize(message)
}

function capitalize(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}
