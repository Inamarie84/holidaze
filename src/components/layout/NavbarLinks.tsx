// src/components/layout/NavbarLinks.tsx
'use client'
import Link from 'next/link'
import IconHint from '@/components/ui/IconHint'
import {
  MapPin,
  PlusCircle,
  LogIn,
  UserPlus,
  User2,
  LogOut,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

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
    <div className="ms-auto flex min-w-0 flex-wrap items-center gap-2 max-[430px]:gap-1">
      <IconHint label="Browse venues">
        <Link
          href="/venues"
          prefetch={pathname !== '/venues'}
          aria-label="Browse venues"
          title="Browse venues"
          className="inline-flex h-9 items-center leading-none gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2"
        >
          <MapPin size={18} aria-hidden="true" />
          <span className="hidden sm:inline max-[430px]:hidden">
            Browse venues
          </span>
          <span className="sm:hidden max-[430px]:hidden">Venues</span>
        </Link>
      </IconHint>

      {hasHydrated && isAuthed && isManager && (
        <IconHint label="Create venue">
          <Link
            href="/venues/new"
            aria-label="Create venue"
            title="Create venue"
            className="inline-flex h-9 items-center leading-none gap-1 rounded-lg bg-emerald px-3 text-sm text-white hover:opacity-90 max-[430px]:px-2 cursor-pointer"
          >
            <PlusCircle size={18} aria-hidden="true" />
            <span className="hidden sm:inline max-[430px]:hidden">
              Create venue
            </span>
            <span className="sm:hidden max-[430px]:hidden">Create</span>
          </Link>
        </IconHint>
      )}

      {hasHydrated && isAuthed ? (
        <>
          <IconHint label="Profile">
            <Link
              href="/profile"
              aria-label="Profile"
              title={userName ?? 'Profile'}
              className="inline-flex h-9 items-center leading-none gap-1 rounded-lg border border-white/20 bg-terracotta/90 px-3 text-sm hover:bg-terracotta/70 max-[430px]:px-2 cursor-pointer"
            >
              <User2 size={18} aria-hidden="true" />
              <span className="hidden sm:inline max-[430px]:hidden">
                {userName ?? 'Profile'}
              </span>
              <span className="sm:hidden max-[430px]:hidden">Profile</span>
            </Link>
          </IconHint>

          <IconHint label="Log out">
            <button
              onClick={onLogout}
              aria-label="Log out"
              title="Log out"
              className="inline-flex h-9 items-center leading-none gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
            >
              <LogOut size={18} aria-hidden="true" />
              <span className="hidden sm:inline max-[430px]:hidden">
                Log out
              </span>
              <span className="sm:hidden max-[430px]:hidden">Logout</span>
            </button>
          </IconHint>
        </>
      ) : (
        <>
          <IconHint label="Register">
            <button
              onClick={onOpenRegister}
              aria-label="Register"
              title="Register"
              className="inline-flex h-9 items-center leading-none gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
            >
              <UserPlus size={18} aria-hidden="true" />
              <span className="hidden sm:inline max-[430px]:hidden">
                Register
              </span>
            </button>
          </IconHint>

          <IconHint label="Log in">
            <button
              onClick={onOpenLogin}
              aria-label="Log in"
              title="Log in"
              className="inline-flex h-9 items-center leading-none gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
            >
              <LogIn size={18} aria-hidden="true" />
              <span className="hidden sm:inline max-[430px]:hidden">
                Log in
              </span>
              <span className="sm:hidden max-[430px]:hidden">Login</span>
            </button>
          </IconHint>
        </>
      )}
    </div>
  )
}
