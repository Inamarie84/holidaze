'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/store/session'
import NavbarLogo from './NavbarLogo'
import NavbarLinks from './NavbarLinks'
import NavbarSkeleton from './NavbarSkeleton'
import useNavHeight from './useNavHeight'
import { RegisterModal, LoginModal } from './AuthModals'

export default function Navbar() {
  const { user, token, logout, hasHydrated } = useSession()
  const isManager = !!user?.venueManager
  const isAuthed = !!token

  const [openRegister, setOpenRegister] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const router = useRouter()

  const headerRef = useRef<HTMLElement>(null)
  useNavHeight(headerRef)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!token) return
    if (openLogin || openRegister) {
      setOpenLogin(false)
      setOpenRegister(false)
      router.push('/profile')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, openLogin, openRegister])

  return (
    <>
      {!hasHydrated && <NavbarSkeleton ref={headerRef} />}

      <header
        ref={headerRef}
        className={[
          'sticky top-0 z-50',
          'min-h-[var(--nav-height)]',
          // Glassy dark using your --foreground
          'bg-[rgba(var(--foreground-rgb),0.85)] supports-[backdrop-filter]:bg-[rgba(var(--foreground-rgb),0.72)] backdrop-blur-md',
          scrolled
            ? 'border-b border-black/10 shadow-md shadow-black/10'
            : 'border-b-0',
          'text-white transition-[box-shadow,border-color]',
        ].join(' ')}
      >
        <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile: stacked; Desktop: single row, perfectly centered */}
          <div className="flex flex-col gap-2 py-2 md:py-0 md:h-[var(--nav-height)] md:flex-row md:items-center md:justify-between">
            <NavbarLogo />
            <NavbarLinks
              hasHydrated={hasHydrated}
              isAuthed={isAuthed}
              isManager={isManager}
              userName={user?.name}
              onLogout={() => {
                logout()
                router.push('/')
              }}
              onOpenLogin={() => setOpenLogin(true)}
              onOpenRegister={() => setOpenRegister(true)}
            />
          </div>
        </nav>
      </header>

      <RegisterModal
        open={openRegister}
        onClose={() => setOpenRegister(false)}
      />
      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  )
}
