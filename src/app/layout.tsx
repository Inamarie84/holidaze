import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { Inter, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SessionHydrator from '@/components/SessionHydrator'
import ToastHost from '@/components/ui/ToastHost'
import BackToTop from '@/components/ui/BackToTop'
import RouteHistoryTracker from '@/components/RouteHistoryTracker'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: {
    default: 'Holidaze',
    template: '%s • Holidaze',
  },
  description: 'Modern accommodation booking site',
  icons: { icon: '/icon.png' },
}

/**
 * Root layout: global providers, nav/footer, and app chrome.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${dmSerif.variable} antialiased flex min-h-screen flex-col`}
      >
        {/* Hydrate session store ASAP for client components */}
        <SessionHydrator />

        <ToastHost />
        <Navbar />

        {/* Track route history for “smart back” behavior */}
        <Suspense fallback={null}>
          <RouteHistoryTracker />
        </Suspense>

        <main id="content" className="flex-1">
          {children}
        </main>

        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
