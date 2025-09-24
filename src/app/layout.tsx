// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SessionHydrator from '@/components/SessionHydrator'
import ToastHost from '@/components/ui/ToastHost'
import BackToTop from '@/components/ui/BackToTop'
import RouteHistoryTracker from '@/components/RouteHistoryTracker'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Holidaze',
  description: 'Modern accommodation booking site',
  icons: {
    icon: '/icon.png', // you already have src/app/icon.png
    // apple: '/apple-icon.png', // if you have one
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${dmSerif.variable} antialiased flex min-h-screen flex-col`}
      >
        {/* Hydrate session from localStorage before auth-gated UI renders */}
        <SessionHydrator />

        <ToastHost />
        <Navbar />
        <Suspense fallback={null}>
          <RouteHistoryTracker />
        </Suspense>
        {/* Offset for sticky navbar (relies on --nav-height set by Navbar) */}
        <main id="content" className="flex-1 pt-[var(--nav-height)]">
          {children}
        </main>

        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
