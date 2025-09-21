'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { loginUser } from '@/services/auth'
import { useSession } from '@/store/session'
import { errMsg } from '@/utils/errors'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const role = sp.get('role')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      await loginUser({ email: email.trim(), password })
      const { user } = useSession.getState()
      toast.success(`Welcome, ${user?.name ?? 'there'}!`)
      router.push('/profile')
    } catch (err) {
      toast.error(errMsg(err))
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
            autoComplete="email"
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
            autoComplete="current-password"
            className="w-full rounded-lg border border-black/15 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="inline-flex items-center justify-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </main>
  )
}
