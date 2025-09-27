'use client'
import Link from 'next/link'
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
      <Link
        href="/venues"
        prefetch={pathname !== '/venues'}
        aria-label="Browse venues"
        className="inline-flex h-9 items-center leading-none gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
      >
        <MapPin size={18} aria-hidden="true" />
        <span className="hidden sm:inline max-[430px]:hidden">
          Browse venues
        </span>
        <span className="sm:hidden max-[430px]:hidden">Venues</span>
      </Link>

      {hasHydrated && isAuthed && isManager && (
        <Link
          href="/venues/new"
          aria-label="Create venue"
          className="inline-flex h-9 items-center leading-none gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
        >
          <PlusCircle size={18} aria-hidden="true" />
          <span className="hidden sm:inline max-[430px]:hidden">
            Create venue
          </span>
          <span className="sm:hidden max-[430px]:hidden">Create</span>
        </Link>
      )}

      {hasHydrated && isAuthed ? (
        <>
          <Link
            href="/profile"
            aria-label="Profile"
            title={userName ?? 'Profile'}
            className="inline-flex h-9 items-center leading-none gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
          >
            <User2 size={18} aria-hidden="true" />
            <span className="hidden sm:inline max-[430px]:hidden">
              {userName ?? 'Profile'}
            </span>
            <span className="sm:hidden max-[430px]:hidden">Profile</span>
          </Link>

          <button
            onClick={onLogout}
            aria-label="Log out"
            className="inline-flex h-9 items-center leading-none gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
          >
            <LogOut size={18} aria-hidden="true" />
            <span className="hidden sm:inline max-[430px]:hidden">Log out</span>
            <span className="sm:hidden max-[430px]:hidden">Logout</span>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onOpenRegister}
            aria-label="Register"
            className="inline-flex h-9 items-center leading-none gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
          >
            <UserPlus size={18} aria-hidden="true" />
            <span className="hidden sm:inline max-[430px]:hidden">
              Register
            </span>
          </button>

          <button
            onClick={onOpenLogin}
            aria-label="Log in"
            className="inline-flex h-9 items-center leading-none gap-1 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10 max-[430px]:px-2 cursor-pointer"
          >
            <LogIn size={18} aria-hidden="true" />
            <span className="hidden sm:inline max-[430px]:hidden">Log in</span>
            <span className="sm:hidden max-[430px]:hidden">Login</span>
          </button>
        </>
      )}
    </div>
  )
}
