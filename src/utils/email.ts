/**
 * Noroff domain helpers used by auth forms/validation.
 */

/** Noroff student email domain (case-insensitive check). */
export const NOROFF_DOMAIN = '@stud.noroff.no'

/** Returns true if email ends with the Noroff domain. */
export function isNoroffStudentEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(NOROFF_DOMAIN)
}
