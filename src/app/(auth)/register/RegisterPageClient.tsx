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
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'manager'>(initialRole)
  const [loading, setLoading] = useState(false)

  const nameError = !name.trim() ? 'Name is required.' : null
  const emailError =
    role === 'manager' && !isNoroffStudentEmail(email)
      ? `${NOROFF_DOMAIN} address required`
      : null
  const passwordError =
    password.length < 8 ? 'Password must be at least 8 characters' : null

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

  return (
    <section
      aria-labelledby="register-heading"
      className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 id="register-heading" className="h1 mb-4">
        Create account
      </h1>
      <p className="muted mb-6">
        Use your <b>{NOROFF_DOMAIN}</b> email{' '}
        {role === 'manager' ? '(required)' : '(required)'}.
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
            pattern={`^.+${NOROFF_DOMAIN.replace('.', '\\.')}$`}
            title={`Email must end with ${NOROFF_DOMAIN} for venue managers`}
            disabled={loading}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? 'email-error' : undefined}
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
          />
        </FormField>

        <fieldset className="rounded-lg border border-black/10 p-3">
          <legend className="body mb-2">Account type</legend>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="customer"
                checked={role === 'customer'}
                onChange={() => setRole('customer')}
                disabled={loading}
              />
              Customer
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="manager"
                checked={role === 'manager'}
                onChange={() => setRole('manager')}
                disabled={loading}
              />
              Venue Manager
            </label>
          </div>
        </fieldset>

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
