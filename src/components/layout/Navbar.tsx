// src/components/nav/Navbar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSession } from '@/store/session'
import { useRouter, usePathname } from 'next/navigation'
import { LogIn, LogOut, User2, PlusCircle, MapPin } from 'lucide-react'
import { RegisterModal, LoginModal } from './AuthModals'

export default function Navbar() {
  const { user, token, logout } = useSession()
  const [openRegister, setOpenRegister] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  // ✅ Only redirect to /profile after a successful auth if a modal triggered it
  useEffect(() => {
    if (!token) return
    if (openLogin || openRegister) {
      setOpenLogin(false)
      setOpenRegister(false)
      // optional: only redirect if you're currently on /login or /register routes
      // or if you explicitly want to go to profile after modal auth:
      router.push('/profile')
    }
    // If token exists but no modal was open, do nothing (no global bounce)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, openLogin, openRegister])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'w-full border-b border-black/10 text-white',
          'bg-[var(--color-foreground)] supports-[backdrop-filter]:bg-[var(--color-foreground)]/90 backdrop-blur',
          scrolled ? 'shadow-md shadow-black/10' : '',
          'transition-shadow',
        ].join(' ')}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.svg"
              alt="Holidaze"
              width={120}
              height={32}
            />

            <span className="sr-only">Holidaze</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Browse Venues always visible */}
            <Link
              href="/venues"
              className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10 cursor-pointer"
              prefetch={pathname !== '/venues'}
            >
              <MapPin size={18} />
              <span className="hidden sm:inline">Browse venues</span>
            </Link>

            {/* Optional: quick create for managers */}
            {user?.venueManager && (
              <Link
                href="/venues/new"
                className="inline-flex items-center gap-1 rounded-lg bg-emerald px-3 py-2 hover:opacity-90 cursor-pointer"
              >
                <PlusCircle size={18} />
                <span className="hidden sm:inline">Create venue</span>
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
                  className="inline-flex items-center gap-1 rounded-lg border bg-terracotta/90 border-white/20 px-3 py-2 hover:bg-terracotta/60 cursor-pointer"
                >
                  <User2 size={18} />
                  <span className="hidden sm:inline">
                    {user?.name ?? 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    router.push('/') // go to home after logout
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10 cursor-pointer"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Auth modals */}
      <RegisterModal
        open={openRegister}
        onClose={() => setOpenRegister(false)}
      />
      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  )
}
