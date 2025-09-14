'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { loginUser } from '@/services/auth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const role = sp.get('role') // optional, you could tailor copy if needed

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await loginUser({ email, password })
      toast.success('Welcome back!')
      router.push('/') // go home (or /manage if manager, etc.)
    } catch (err: any) {
      toast.error(err?.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="h1 mb-4">Log in</h1>
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
          className="inline-flex items-center justify-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </main>
  )
}
