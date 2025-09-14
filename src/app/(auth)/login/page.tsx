'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { loginUser } from '@/services/auth'
import { useSession } from '@/store/session'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const prefillEmail = sp.get('email') ?? ''

  const [email, setEmail] = useState(prefillEmail)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const login = useSession((s) => s.login)

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail)
  }, [prefillEmail])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginUser({ email, password })
      // res: { accessToken, name, email, venueManager? }
      login({
        token: res.accessToken,
        user: {
          name: res.name,
          email: res.email,
          venueManager: res.venueManager,
        },
      })
      toast.success('Logged in!')
      router.push('/') // go home (or /profile)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="h1 mb-4">Log in</h1>
      <p className="muted mb-6">Welcome back to Holidaze.</p>

      <form onSubmit={onSubmit} className="grid gap-4">
        <div>
          <label htmlFor="email" className="body block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            placeholder="you@stud.noroff.no"
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

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Log in'}
        </button>

        <p className="muted">
          New here?{' '}
          <a href="/(auth)/register" className="underline">
            Create an account
          </a>
          .
        </p>
      </form>
    </main>
  )
}
