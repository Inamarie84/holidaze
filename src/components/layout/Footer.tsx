import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import { SiInstagram, SiFacebook, SiMessenger, SiTiktok } from 'react-icons/si'
import type { IconType } from 'react-icons'

/**
 * Site footer: brand link, quick links, contact, and socials.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-black/10 bg-sand">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Link
          href="/venues"
          aria-label="Holidaze — go to home"
          className="inline-flex items-center gap-2 hover:opacity-90"
        >
          <Image
            src="/icon.png"
            alt=""
            width={28}
            height={28}
            className="rounded"
            priority
          />
          <span className="h2">Holidaze</span>
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <nav
            aria-label="Footer navigation"
            className="text-center sm:text-left"
          >
            <div className="font-semibold mb-2">Explore</div>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/venues" className="hover:underline">
                  Browse venues
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li className="text-grey">Privacy (coming soon)</li>
              <li className="text-grey">Terms (coming soon)</li>
            </ul>
          </nav>

          <address className="not-italic text-center">
            <div className="font-semibold mb-2">Contact</div>
            <p className="text-sm">
              Phone:{' '}
              <a href="tel:+4740404040" className="hover:underline">
                +47 40 40 40 40
              </a>
            </p>
            <p className="text-sm">
              Email:{' '}
              <a href="mailto:support@holidaze.com" className="hover:underline">
                support@holidaze.com
              </a>
            </p>
          </address>

          <div className="text-center sm:text-right">
            <div className="font-semibold mb-2">Follow us</div>
            <div className="flex items-center justify-center sm:justify-end gap-4">
              <BrandIconLink
                href="https://instagram.com/yourpage"
                label="Instagram"
                as={SiInstagram}
              />
              <BrandIconLink
                href="https://facebook.com/yourpage"
                label="Facebook"
                as={SiFacebook}
              />
              <BrandIconLink
                href="https://m.me/yourpage"
                label="Messenger"
                as={SiMessenger}
              />
              <BrandIconLink
                href="https://tiktok.com/@yourpage"
                label="TikTok"
                as={SiTiktok}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <p className="body text-grey text-center">© {year} Holidaze.</p>
        </div>
      </div>
    </footer>
  )
}

function BrandIconLink({
  as,
  label,
  href,
}: {
  as: IconType
  label: string
  href: string
}) {
  const Icon = as as unknown as React.ComponentType<{
    className?: string
    size?: number
    'aria-hidden'?: boolean
  }>
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="transition-opacity hover:opacity-80 focus:opacity-80"
    >
      <Icon className="h-5 w-5" size={20} aria-hidden />
    </a>
  )
}
