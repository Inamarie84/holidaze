'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/store/session'
import NavbarLogo from './NavbarLogo'
import NavbarLinks from './NavbarLinks'
import MobileMenu from './MobileMenu' // ⬅️ mobile menu
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
  const headerRef = useNavHeight() // updates --nav-height CSS var

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // If user finishes login/register via modals, route to profile
  useEffect(() => {
    if (!token) return
    if (openLogin || openRegister) {
      setOpenLogin(false)
      setOpenRegister(false)
      router.push('/profile')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, openLogin, openRegister])

  // Navigate away first, then clear the session (prevents /profile guard from bouncing to /login)
  function logoutAndGoHome() {
    router.replace('/venues') // go somewhere public first
    requestAnimationFrame(() => logout()) // then clear session
  }

  return (
    <>
      <header
        ref={headerRef}
        className={[
          'sticky top-0 z-50',
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
          {/* One row: logo left, desktop links right, mobile trigger right (hidden on md+) */}
          <div className="flex items-center justify-between py-2">
            <NavbarLogo />

            {/* Desktop links (md and up) */}
            <div className="hidden md:block">
              <NavbarLinks
                hasHydrated={hasHydrated}
                isAuthed={isAuthed}
                isManager={isManager}
                userName={user?.name}
                onLogout={logoutAndGoHome}
                onOpenLogin={() => setOpenLogin(true)}
                onOpenRegister={() => setOpenRegister(true)}
              />
            </div>

            {/* Mobile menu trigger + portal panel (< md) */}
            <div className="md:hidden">
              <MobileMenu
                isAuthed={isAuthed}
                isManager={isManager}
                userName={user?.name}
                onLogout={logoutAndGoHome}
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
