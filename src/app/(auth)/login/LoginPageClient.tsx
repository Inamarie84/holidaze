'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { loginUser } from '@/services/auth'
import { useSession } from '@/store/session'
import { errMsg } from '@/utils/errors'
import toast from 'react-hot-toast'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { SubmitButton } from '@/components/ui/SubmitButton'

type Props = { role?: string; redirect: string }

export default function LoginPageClient({ role, redirect }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      await loginUser({ email: email.trim(), password })
      const { user } = useSession.getState()
      toast.success(`Welcome, ${user?.name ?? 'there'}!`)
      router.push(redirect)
    } catch (err) {
      toast.error(errMsg(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      aria-labelledby="login-heading"
      className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 id="login-heading" className="h1 mb-4">
        Log in
      </h1>

      {role && (
        <p className="muted mb-4">
          You’re logging in as <b>{role}</b>.
        </p>
      )}

      <form
        onSubmit={onSubmit}
        aria-describedby={loading ? 'login-status' : undefined}
        className="space-y-4"
      >
        <FormField id="email" label="Email">
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            aria-required="true"
            disabled={loading}
          />
        </FormField>

        <FormField id="password" label="Password">
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-required="true"
            disabled={loading}
          />
        </FormField>

        <SubmitButton busy={loading}>
          {loading ? 'Signing in…' : 'Log in'}
        </SubmitButton>

        <p
          id="login-status"
          className="sr-only"
          role="status"
          aria-live="polite"
        >
          {loading ? 'Signing in…' : ''}
        </p>
      </form>
    </section>
  )
}
