'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession } from '@/store/session'
import { LogIn, LogOut, User2, PlusCircle } from 'lucide-react'
import { RegisterModal, LoginModal } from './AuthModals'

export default function Navbar() {
  const { user, token, logout } = useSession()
  const [openRegister, setOpenRegister] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)

  return (
    <header className="w-full border-b border-black/10 bg-[var(--color-foreground)] text-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt="Holidaze"
            width={120}
            height={32}
            priority
          />
          <span className="sr-only">Holidaze</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/venues" className="body hover:underline">
            Venues
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user?.venueManager && (
            <Link
              href="/manage"
              className="inline-flex items-center gap-1 rounded-lg bg-emerald px-3 py-2 hover:opacity-90"
              title="Manage venues"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Manage</span>
            </Link>
          )}

          {!token ? (
            <>
              <button
                onClick={() => setOpenRegister(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10"
              >
                Register
              </button>
              <button
                onClick={() => setOpenLogin(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Log in</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10"
              >
                <User2 size={18} />
                <span className="hidden sm:inline">
                  {user?.name ?? 'Profile'}
                </span>
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10"
                title="Log out"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          )}
        </div>
      </nav>

      <RegisterModal
        open={openRegister}
        onClose={() => setOpenRegister(false)}
      />
      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
    </header>
  )
}
