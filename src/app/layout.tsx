// src/app/layout.tsx

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

export const metadata = {
  title: {
    default: 'Holidaze',
    template: '%s • Holidaze',
  },
  description: 'Modern accommodation booking site',
  icons: { icon: '/icon.png' },
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
        {/* Make the session available to all client components immediately */}
        <SessionHydrator />

        <ToastHost />
        <Navbar />
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
