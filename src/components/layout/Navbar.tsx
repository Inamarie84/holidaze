// src/components/nav/Navbar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useSession } from '@/store/session'
import { useRouter, usePathname } from 'next/navigation'
import {
  LogIn,
  LogOut,
  User2,
  UserPlus,
  PlusCircle,
  MapPin,
} from 'lucide-react'
import { RegisterModal, LoginModal } from './AuthModals'
import IconHint from '@/components/ui/IconHint'

export default function Navbar() {
  const { user, token, logout } = useSession()
  const [openRegister, setOpenRegister] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  // Publish header height as --nav-height
  const headerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const setVar = () =>
      document.documentElement.style.setProperty(
        '--nav-height',
        `${el.offsetHeight}px`
      )
    setVar()
    const ro = new ResizeObserver(setVar)
    ro.observe(el)
    window.addEventListener('resize', setVar, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', setVar)
    }
  }, [])

  // Redirect to profile after modal auth
  useEffect(() => {
    if (!token) return
    if (openLogin || openRegister) {
      setOpenLogin(false)
      setOpenRegister(false)
      router.push('/profile')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, openLogin, openRegister])

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        className={[
          'fixed inset-x-0 top-0 z-50',
          // ↓ only add border when scrolled
          scrolled ? 'border-b border-black/10' : 'border-b-0',
          'text-white bg-[var(--color-foreground)] supports-[backdrop-filter]:bg-[var(--color-foreground)]/90 backdrop-blur',
          scrolled ? 'shadow-md shadow-black/10' : '',
          'transition-[box-shadow,border-color]',
        ].join(' ')}
      >
        <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Two rows on mobile; single row on md+ */}
          <div className="flex flex-col gap-2 py-2 md:h-16 md:flex-row md:items-center md:justify-between">
            {/* Row 1: Logo */}
            <div className="flex items-center justify-between md:justify-start">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <Image
                  src="/images/logo.svg"
                  alt="Holidaze"
                  width={120}
                  height={32}
                />
                <span className="sr-only">Holidaze</span>
              </Link>
            </div>

            {/* Row 2: Actions */}
            <div className="ms-auto flex min-w-0 flex-wrap items-center gap-2 max-[430px]:gap-1">
              {/* Browse Venues */}
              <IconHint label="Browse venues">
                <Link
                  href="/venues"
                  prefetch={pathname !== '/venues'}
                  aria-label="Browse venues"
                  title="Browse venues"
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2"
                >
                  <MapPin size={18} aria-hidden="true" />
                  <span className="hidden sm:inline max-[430px]:hidden">
                    Browse venues
                  </span>
                  <span className="sm:hidden max-[430px]:hidden">Venues</span>
                </Link>
              </IconHint>

              {/* Create (managers) */}
              {user?.venueManager && (
                <IconHint label="Create venue">
                  <Link
                    href="/venues/new"
                    aria-label="Create venue"
                    title="Create venue"
                    className="inline-flex h-9 items-center gap-1 rounded-lg bg-emerald px-3 text-sm text-white hover:opacity-90 max-[430px]:px-2 cursor-pointer"
                  >
                    <PlusCircle size={18} aria-hidden="true" />
                    <span className="hidden sm:inline max-[430px]:hidden">
                      Create venue
                    </span>
                    <span className="sm:hidden max-[430px]:hidden">Create</span>
                  </Link>
                </IconHint>
              )}

              {!token ? (
                <>
                  {/* Register */}
                  <IconHint label="Register">
                    <button
                      onClick={() => setOpenRegister(true)}
                      aria-label="Register"
                      title="Register"
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
                    >
                      <UserPlus size={18} aria-hidden="true" />
                      <span className="hidden sm:inline max-[430px]:hidden">
                        Register
                      </span>
                    </button>
                  </IconHint>

                  {/* Log in */}
                  <IconHint label="Log in">
                    <button
                      onClick={() => setOpenLogin(true)}
                      aria-label="Log in"
                      title="Log in"
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
                    >
                      <LogIn size={18} aria-hidden="true" />
                      <span className="hidden sm:inline max-[430px]:hidden">
                        Log in
                      </span>
                      <span className="sm:hidden max-[430px]:hidden">
                        Login
                      </span>
                    </button>
                  </IconHint>
                </>
              ) : (
                <>
                  {/* Profile */}
                  <IconHint label="Profile">
                    <Link
                      href="/profile"
                      aria-label="Profile"
                      title={user?.name ?? 'Profile'}
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/20 bg-terracotta/90 px-3 text-sm hover:bg-terracotta/70 max-[430px]:px-2 cursor-pointer"
                    >
                      <User2 size={18} aria-hidden="true" />
                      <span className="hidden sm:inline max-[430px]:hidden">
                        {user?.name ?? 'Profile'}
                      </span>
                      <span className="sm:hidden max-[430px]:hidden">
                        Profile
                      </span>
                    </Link>
                  </IconHint>

                  {/* Log out */}
                  <IconHint label="Log out">
                    <button
                      onClick={() => {
                        logout()
                        router.push('/')
                      }}
                      aria-label="Log out"
                      title="Log out"
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
                    >
                      <LogOut size={18} aria-hidden="true" />
                      <span className="hidden sm:inline max-[430px]:hidden">
                        Log out
                      </span>
                      <span className="sm:hidden max-[430px]:hidden">
                        Logout
                      </span>
                    </button>
                  </IconHint>
                </>
              )}
            </div>
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
