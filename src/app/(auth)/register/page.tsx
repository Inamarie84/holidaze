'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { registerUser } from '@/services/auth'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const initialRole = sp.get('role') === 'manager' ? 'manager' : 'customer'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'manager'>(initialRole)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const venueManager = role === 'manager'
      await registerUser({ name, email, password, venueManager })
      toast.success('Account created! You can now log in.')
      router.push(`/login?role=${role}`)
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      // common Noroff cases: existing email, invalid domain, weak password
      if (/exist/i.test(msg)) {
        toast.error('That email is already registered.')
      } else if (/stud\.noroff\.no/i.test('') && /noroff/i.test(msg)) {
        // just a guard to keep the eslint happy; we key off `msg`:
        toast.error(msg)
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="h1 mb-4">Create account</h1>
      <p className="muted mb-6">
        Use your <b>@stud.noroff.no</b> email (required for Venue Manager).
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="body block mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2"
          />
        </div>

        <div>
          <label className="body block mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@stud.noroff.no"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2"
          />
        </div>

        <div>
          <label className="body block mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2"
          />
        </div>

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
              />
              Venue Manager
            </label>
          </div>
        </fieldset>

        <button
          disabled={loading}
          aria-busy={loading}
          className="inline-flex items-center justify-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </main>
  )
}
