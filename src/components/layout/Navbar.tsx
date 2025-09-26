'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from '@/store/session'
import NavbarLogo from './NavbarLogo'
import NavbarLinks from './NavbarLinks'
import useNavHeight from './useNavHeight'
import { RegisterModal, LoginModal } from './AuthModals'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const { user, token, logout, hasHydrated } = useSession()
  const isManager = !!user?.venueManager
  const isAuthed = !!token

  const [openRegister, setOpenRegister] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const headerRef = useNavHeight()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // If a modal was open and we got a token, go to profile
  useEffect(() => {
    if (!token) return
    if (openLogin || openRegister) {
      setOpenLogin(false)
      setOpenRegister(false)
      router.push('/profile')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, openLogin, openRegister])

  // ✅ Race-safe logout: navigate to a public route, then clear token
  const pendingLogoutRef = useRef(false)

  const handleLogout = useCallback(() => {
    // 1) mark that we want to logout after navigation completes
    pendingLogoutRef.current = true
    // 2) navigate to a public route first so no AuthGate can hijack
    router.push('/venues')
  }, [router])

  // When the path changes to /venues AND a logout is pending, clear the session
  useEffect(() => {
    if (pendingLogoutRef.current && pathname === '/venues') {
      // 3) now it's safe to clear the token (we're on a public page)
      logout()
      pendingLogoutRef.current = false
    }
  }, [pathname, logout])

  return (
    <>
      <header
        ref={headerRef}
        className={[
          'sticky top-0 z-[200]',
          scrolled
            ? 'bg-[#1c1c1cCC] supports-[backdrop-filter]:bg-[#1c1c1cB8] backdrop-blur-md'
            : 'bg-[#1c1c1c]    supports-[backdrop-filter]:bg-[#1c1c1cF2] backdrop-blur',
          scrolled
            ? 'border-b border-black/10 shadow-md shadow-black/10'
            : 'border-b-0',
          'text-white transition-[background-color,box-shadow,border-color]',
        ].join(' ')}
      >
        <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 py-2 md:flex-row md:items-center md:justify-between">
            <NavbarLogo />
            <NavbarLinks
              hasHydrated={hasHydrated}
              isAuthed={isAuthed}
              isManager={isManager}
              userName={user?.name}
              onLogout={handleLogout}
              onOpenLogin={() => setOpenLogin(true)}
              onOpenRegister={() => setOpenRegister(true)}
            />
            <div className="md:hidden">
              <MobileMenu
                isAuthed={isAuthed}
                isManager={isManager}
                userName={user?.name}
                onLogout={handleLogout}
                onOpenLogin={() => setOpenLogin(true)}
                onOpenRegister={() => setOpenRegister(true)}
              />
            </div>
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
