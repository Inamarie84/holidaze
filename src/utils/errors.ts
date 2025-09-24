// src/utils/errors.ts

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function getString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined
}

function getNumber(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined
}

/**
 * Extract a human-friendly message from Noroff v2 API errors, our api() throws,
 * fetch/Response shapes, or generic JS errors. Safe to use everywhere.
 */
export function errMsg(e: unknown): string {
  // Standard JS Error
  if (e instanceof Error && e.message) return e.message

  // Many of our thrown errors attach a 'body' object
  const body =
    isRecord(e) && 'body' in e && isRecord((e as Record<string, unknown>).body)
      ? ((e as Record<string, unknown>).body as Record<string, unknown>)
      : undefined

  // Noroff { body: { errors: [{ message }] } }
  const maybeErrors = body?.errors
  if (Array.isArray(maybeErrors) && maybeErrors.length > 0) {
    const messages = maybeErrors
      .map((it) => {
        if (typeof it === 'string') return it
        if (isRecord(it) && typeof it.message === 'string') return it.message
        return undefined
      })
      .filter(Boolean)
      .join(', ')
    if (messages) {
      const statusCode = getNumber(body?.statusCode)
      return humanize(messages, statusCode)
    }
  }

  // Noroff { body: { message, status, statusCode } }
  if (
    body &&
    (typeof body.message === 'string' || typeof body.status === 'string')
  ) {
    const msg = getString(body.message) ?? getString(body.status) ?? 'Error'
    const statusCode = getNumber(body.statusCode)
    return humanize(msg, statusCode)
  }

  // Flat error shapes { message, statusCode }
  if (isRecord(e)) {
    const flatMsg = getString(e.message)
    const flatCode = getNumber(e.statusCode)
    if (flatMsg || typeof flatCode === 'number') {
      return humanize(flatMsg ?? 'Error', flatCode)
    }
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
