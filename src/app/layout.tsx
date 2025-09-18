// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import SessionHydrator from '@/components/SessionHydrator'
import { Toaster } from 'react-hot-toast'

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
      <body className={`${inter.variable} ${dmSerif.variable} antialiased`}>
        <SessionHydrator />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

        {/* Sticky navbar is 64px (h-16). We offset once here with pt-16. */}
        <Navbar />
        <main className="pt-16 min-h-[100dvh]">{children}</main>
      </body>
    </html>
  )
}
