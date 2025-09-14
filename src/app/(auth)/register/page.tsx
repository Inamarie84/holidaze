'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { registerUser } from '@/services/auth'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const role = (sp.get('role') ?? 'customer') as 'customer' | 'manager'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [venueManager, setVenueManager] = useState(role === 'manager')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setVenueManager(role === 'manager')
  }, [role])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/@stud\.noroff\.no$/i.test(email)) {
      toast.error('Use your @stud.noroff.no email.')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await registerUser({ name, email, password, venueManager })
      toast.success('Account created! Please log in.')
      router.push(`/(auth)/login?email=${encodeURIComponent(email)}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="h1 mb-4">Create account</h1>
      <p className="muted mb-6">Register as a Customer or Venue Manager.</p>

      <form onSubmit={onSubmit} className="grid gap-4">
        <div>
          <label htmlFor="name" className="body block mb-1">
            Name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="body block mb-1">
            Email (@stud.noroff.no)
          </label>
          <input
            id="email"
            type="email"
            required
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            placeholder="name@stud.noroff.no"
          />
        </div>

        <div>
          <label htmlFor="password" className="body block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            placeholder="••••••••"
            minLength={8}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="manager"
            type="checkbox"
            checked={venueManager}
            onChange={(e) => setVenueManager(e.target.checked)}
          />
          <label htmlFor="manager" className="body">
            I am a Venue Manager
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>

        <p className="muted">
          Already have an account?{' '}
          <a href="/(auth)/login" className="underline">
            Log in
          </a>
          .
        </p>
      </form>
    </main>
  )
}
