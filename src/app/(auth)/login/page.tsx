'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { loginUser } from '@/services/auth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const role = sp.get('role') // optional: could tweak copy if needed

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await loginUser({ email, password })
      toast.success('Welcome back!')
      router.push('/') // or `/manage` for venueManager if you like
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your email and password.'
      // common Noroff responses include "Invalid email or password"
      if (/invalid/i.test(msg)) {
        toast.error('Invalid email or password.')
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="h1 mb-4">Log in</h1>
      {role && (
        <p className="muted mb-4">
          You’re logging in as <b>{role}</b>.
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="body block mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
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

        <button
          disabled={loading}
          aria-busy={loading}
          className="inline-flex items-center justify-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </main>
  )
}
