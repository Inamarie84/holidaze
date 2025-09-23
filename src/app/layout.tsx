// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SessionHydrator from '@/components/SessionHydrator'
import ToastHost from '@/components/ui/ToastHost'
import BackToTop from '@/components/ui/BackToTop'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Holidaze',
  description: 'Modern accommodation booking site',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased flex min-h-screen flex-col">
        {/* ... */}
        <ToastHost />
        <Navbar />
        <main id="content" className="flex-1 pt-[var(--nav-height,4rem)]">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
