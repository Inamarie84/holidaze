'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { registerUser } from '@/services/auth'
import { errMsg } from '@/utils/errors'
import toast from 'react-hot-toast'
import FormError from '@/components/ui/FormError'

export default function RegisterPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const initialRole = sp.get('role') === 'manager' ? 'manager' : 'customer'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'manager'>(initialRole)
  const [loading, setLoading] = useState(false)

  function isNoroffEmail(e: string) {
    return /@stud\.noroff\.no$/i.test(e.trim())
  }

  const nameError = !name.trim() ? 'Name is required.' : null
  const emailError =
    role === 'manager' && !isNoroffEmail(email)
      ? 'Managers must use @stud.noroff.no'
      : null
  const passwordError =
    password.length < 8 ? 'Password must be at least 8 characters' : null

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (nameError || emailError || passwordError) return

    try {
      setLoading(true)
      const venueManager = role === 'manager'
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        venueManager,
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
    <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="h1 mb-4">Create account</h1>
      <p className="muted mb-6">
        Use your <b>@stud.noroff.no</b> email (required).
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="body block mb-1">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2"
          />
          <FormError message={nameError} />
        </div>

        <div>
          <label htmlFor="email" className="body block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@stud.noroff.no"
            className="w-full rounded-lg border border-black/15 px-3 py-2"
          />
          <FormError message={emailError} />
        </div>

        <div>
          <label htmlFor="password" className="body block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2"
          />
          <FormError message={passwordError} />
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
          type="submit"
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
