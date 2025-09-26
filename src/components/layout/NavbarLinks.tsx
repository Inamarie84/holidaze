'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MapPin,
  PlusCircle,
  LogIn,
  UserPlus,
  User2,
  LogOut,
} from 'lucide-react'

type Props = {
  hasHydrated: boolean
  isAuthed: boolean
  isManager: boolean
  userName?: string
  onLogout: () => void
  onOpenLogin: () => void
  onOpenRegister: () => void
}

export default function NavbarLinks({
  hasHydrated,
  isAuthed,
  isManager,
  userName,
  onLogout,
  onOpenLogin,
  onOpenRegister,
}: Props) {
  const pathname = usePathname()

  return (
    <div className="ms-auto flex min-w-0 flex-wrap items-center gap-2">
      <Link
        href="/venues"
        prefetch={pathname !== '/venues'}
        aria-label="Browse venues"
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 cursor-pointer"
      >
        <MapPin size={18} aria-hidden="true" />
        <span>Browse venues</span>
      </Link>

      {hasHydrated && isAuthed && isManager && (
        <Link
          href="/venues/new"
          aria-label="Create venue"
          className="inline-flex h-9 items-center gap-1 rounded-lg bg-emerald px-3 text-sm text-white hover:opacity-90 cursor-pointer"
        >
          <PlusCircle size={18} aria-hidden="true" />
          <span>Create venue</span>
        </Link>
      )}

      {hasHydrated && isAuthed ? (
        <>
          <Link
            href="/profile"
            aria-label="Profile"
            title={userName ?? 'Profile'}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/20 bg-terracotta/90 px-3 text-sm hover:bg-terracotta/70 cursor-pointer"
          >
            <User2 size={18} aria-hidden="true" />
            <span>{userName ?? 'Profile'}</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Log out"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 cursor-pointer"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>Log out</span>
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={onOpenRegister}
            aria-label="Register"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 cursor-pointer"
          >
            <UserPlus size={18} aria-hidden="true" />
            <span>Register</span>
          </button>

          <button
            type="button"
            onClick={onOpenLogin}
            aria-label="Log in"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 cursor-pointer"
          >
            <LogIn size={18} aria-hidden="true" />
            <span>Log in</span>
          </button>
        </>
      )}
    </div>
  )
}
