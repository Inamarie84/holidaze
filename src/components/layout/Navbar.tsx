'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { useSession } from '@/store/session'
import { LogIn, LogOut, User2, PlusCircle } from 'lucide-react'

export default function Navbar() {
  const { user, token, logout } = useSession()
  const [openRegister, setOpenRegister] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)

  return (
    <header className="w-full border-b border-black/10 bg-[var(--color-foreground)] text-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo → home */}
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

        {/* Primary links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/venues" className="body hover:underline">
            Venues
          </Link>
        </div>

        {/* Right actions */}
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
                className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10 cursor-pointer"
              >
                Register
              </button>
              <button
                onClick={() => setOpenLogin(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10 cursor-pointer"
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

      {/* Register modal */}
      <Modal
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        title="Create account"
      >
        <p className="body mb-4">Choose the type of account to create:</p>
        <div className="grid gap-2">
          <Link
            prefetch={false}
            href="/register?role=customer"
            onClick={() => setOpenRegister(false)} // <-- close
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90"
          >
            I’m a Customer
          </Link>
          <Link
            prefetch={false}
            href="/register?role=manager"
            onClick={() => setOpenRegister(false)} // <-- close
            className="inline-flex w-full items-center justify-center rounded-lg border border-black/10 px-4 py-2 hover:bg-sand text-brand"
          >
            I’m a Venue Manager
          </Link>
        </div>
        <p className="muted mt-3">
          Note: Use your <b>@stud.noroff.no</b> email.
        </p>
      </Modal>

      {/* Login modal */}
      <Modal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        title="Log in"
      >
        <p className="body mb-4">Log in to your account:</p>
        <div className="grid gap-2">
          <Link
            prefetch={false}
            href="/login?role=customer"
            onClick={() => setOpenLogin(false)} // <-- close
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90"
          >
            Customer login
          </Link>
          <Link
            prefetch={false}
            href="/login?role=manager"
            onClick={() => setOpenLogin(false)} // <-- close
            className="inline-flex w-full items-center justify-center rounded-lg border border-black/10 px-4 py-2 hover:bg-sand text-brand"
          >
            Venue Manager login
          </Link>
        </div>
        <p className="muted mt-3">
          Don’t have an account? Choose Register instead.
        </p>
      </Modal>
    </header>
  )
}
