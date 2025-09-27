// src/app/(auth)/register/RegisterPageClient.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { registerUser } from '@/services/auth'
import { errMsg } from '@/utils/errors'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { isNoroffStudentEmail, NOROFF_DOMAIN } from '@/utils/email'

export default function RegisterPageClient({
  initialRole,
}: {
  initialRole: 'customer' | 'manager'
}) {
  const router = useRouter()
  const [role, setRole] = useState<'customer' | 'manager'>(initialRole)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Validations
  const nameError = !name.trim() ? 'Name is required.' : null
  // 🔴 Noroff email required for both roles
  const emailError =
    email.trim() === ''
      ? '@stud.noroff.no email address is required.'
      : !isNoroffStudentEmail(email)
        ? `${NOROFF_DOMAIN} address required`
        : null
  const passwordError =
    password.length < 8 ? 'Password must be at least 8 characters' : null

  function switchRole(next: 'customer' | 'manager') {
    setRole(next)
    // keep the URL consistent with the role label (like your login page)
    router.replace(`/register?role=${next}`)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading || nameError || emailError || passwordError) return
    try {
      setLoading(true)
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        venueManager: role === 'manager',
      })
      toast.success('Account created! You can now log in.')
      router.push(`/login?role=${role}`)
    } catch (err) {
      toast.error(errMsg(err))
    } finally {
      setLoading(false)
    }
  }

  const roleLabel = role === 'manager' ? 'Venue Manager' : 'Customer'
  const switchTo = role === 'manager' ? 'customer' : 'manager'
  const switchLabel = switchTo === 'manager' ? 'Venue Manager' : 'Customer'

  return (
    <section
      aria-labelledby="register-heading"
      className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 id="register-heading" className="h1 mb-2">
        Create account
      </h1>

      {/* Mirrors the login page messaging */}
      <p className="muted mb-4">
        You’re registering as <b>{roleLabel}</b>.
      </p>

      {/* Small, non-blocking role switch (instead of radios) */}
      <p className="mb-6 text-sm">
        Not what you meant?{' '}
        <button
          type="button"
          onClick={() => switchRole(switchTo)}
          className="underline hover:opacity-80 cursor-pointer"
        >
          Register as {switchLabel}
        </button>
        .
      </p>

      <p className="muted mb-6">
        Use your <b>{NOROFF_DOMAIN}</b> email (required).
      </p>

      <form
        onSubmit={onSubmit}
        className="space-y-4"
        aria-describedby={loading ? 'register-status' : undefined}
      >
        <FormField id="name" label="Name" error={nameError}>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="username"
            disabled={loading}
            aria-invalid={!!nameError}
            aria-describedby={nameError ? 'name-error' : undefined}
            required
          />
        </FormField>

        <FormField id="email" label="Email" error={emailError}>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`you${NOROFF_DOMAIN}`}
            autoComplete="email"
            inputMode="email"
            // 🔒 Require Noroff email for both roles (pattern + title + required)
            pattern={`^.+${NOROFF_DOMAIN.replace('.', '\\.')}$`}
            title={`Email must end with ${NOROFF_DOMAIN}`}
            disabled={loading}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? 'email-error' : undefined}
            required
          />
        </FormField>

        <FormField id="password" label="Password" error={passwordError}>
          <Input
            id="password"
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            disabled={loading}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? 'password-error' : undefined}
            required
          />
        </FormField>

        <SubmitButton busy={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </SubmitButton>

        <p
          id="register-status"
          className="sr-only"
          role="status"
          aria-live="polite"
        >
          {loading ? 'Creating your account…' : ''}
        </p>
      </form>
    </section>
  )
}
