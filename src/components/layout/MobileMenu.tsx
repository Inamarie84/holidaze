// src/components/layout/MobileMenu.tsx
'use client'

import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Link from 'next/link'
import {
  Menu as MenuIcon,
  X as CloseIcon,
  MapPin,
  PlusCircle,
  User2,
  LogOut,
  UserPlus,
  LogIn,
} from 'lucide-react'

type Props = {
  isAuthed: boolean
  isManager: boolean
  userName?: string
  onLogout: () => void
  onOpenLogin: () => void
  onOpenRegister: () => void
}

export default function MobileMenu({
  isAuthed,
  isManager,
  userName,
  onLogout,
  onOpenLogin,
  onOpenRegister,
}: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Make sure we're on the client before using portals
  useEffect(() => setMounted(true), [])

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Single trigger in the navbar row (opens AND closes)
  const trigger = (
    <button
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      className={[
        'inline-flex h-9 items-center gap-2 rounded-lg border border-white/20 px-3 text-sm',
        'md:hidden cursor-pointer outline-none',
        'focus-visible:ring-2 focus-visible:ring-white/30',
        open ? 'bg-white/10' : 'hover:bg-white/10', // looks active when open, hover when closed
      ].join(' ')}
      onClick={() => setOpen((v) => !v)}
    >
      {open ? (
        <CloseIcon size={18} aria-hidden />
      ) : (
        <MenuIcon size={18} aria-hidden />
      )}
      <span>{open ? 'Close' : 'Menu'}</span>
    </button>
  )

  // While not mounted (SSR), just render the trigger (no portal usage)
  if (!mounted) return trigger

  return (
    <>
      {trigger}

      {open
        ? ReactDOM.createPortal(
            <>
              {/* Backdrop — start BELOW the navbar so it never covers the trigger */}
              <div
                className="fixed inset-x-0 bottom-0 z-[180] bg-black/60 md:hidden"
                style={{ top: 'var(--nav-height, 56px)' }} // don’t cover the navbar row
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />

              {/* Panel — below navbar, above backdrop */}
              <div
                className="fixed inset-x-0 bottom-0 z-[190] md:hidden border-t border-white/10 text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                style={{
                  top: 'var(--nav-height, 56px)', // sits just under the navbar
                  backgroundColor: '#1c1c1c',
                  isolation: 'isolate',
                }}
                role="dialog"
                aria-modal="true"
              >
                {/* Centered welcome message */}
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm text-center opacity-85">
                    {isAuthed ? `Welcome, ${userName ?? 'there'}` : 'Welcome'}
                  </p>
                </div>

                {/* Menu links */}
                <nav className="max-h-[calc(100dvh-140px)] overflow-y-auto p-4">
                  <ul className="grid gap-2">
                    <li>
                      <Link
                        href="/venues"
                        className="inline-flex w-full items-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-sm hover:bg-white/10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        onClick={() => setOpen(false)}
                      >
                        <MapPin size={18} aria-hidden />
                        Browse venues
                      </Link>
                    </li>

                    {isAuthed && isManager && (
                      <>
                        <li>
                          <Link
                            href="/venues/new"
                            className="inline-flex w-full items-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-sm hover:bg-white/10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            onClick={() => setOpen(false)}
                          >
                            <PlusCircle size={18} aria-hidden />
                            Create venue
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/profile"
                            className="inline-flex w-full items-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-sm hover:bg-white/10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            onClick={() => setOpen(false)}
                          >
                            <User2 size={18} aria-hidden />
                            Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="inline-flex w-full items-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-left text-sm hover:bg-white/10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            onClick={() => {
                              setOpen(false)
                              onLogout()
                            }}
                          >
                            <LogOut size={18} aria-hidden />
                            Log out
                          </button>
                        </li>
                      </>
                    )}

                    {isAuthed && !isManager && (
                      <>
                        <li>
                          <Link
                            href="/profile"
                            className="inline-flex w-full items-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-sm hover:bg-white/10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            onClick={() => setOpen(false)}
                          >
                            <User2 size={18} aria-hidden />
                            Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="inline-flex w-full items-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-left text-sm hover:bg-white/10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            onClick={() => {
                              setOpen(false)
                              onLogout()
                            }}
                          >
                            <LogOut size={18} aria-hidden />
                            Log out
                          </button>
                        </li>
                      </>
                    )}

                    {!isAuthed && (
                      <>
                        <li>
                          <button
                            type="button"
                            className="inline-flex w-full items-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-left text-sm hover:bg-white/10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            onClick={() => {
                              setOpen(false)
                              onOpenRegister()
                            }}
                          >
                            <UserPlus size={18} aria-hidden />
                            Register
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="inline-flex w-full items-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-left text-sm hover:bg-white/10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            onClick={() => {
                              setOpen(false)
                              onOpenLogin()
                            }}
                          >
                            <LogIn size={18} aria-hidden />
                            Log in
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </nav>
              </div>
            </>,
            document.body
          )
        : null}
    </>
  )
}
