// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter, DM_Serif_Display } from 'next/font/google'
import './globals.css'

// components
import SessionHydrator from '@/components/SessionHydrator'
import { Toaster } from 'react-hot-toast'

// Inter: weights optional (variable font)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

// DM Serif Display: MUST specify weight (only 400 available)
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
        {/* Restore session (token/user) from localStorage into Zustand */}
        <SessionHydrator />

        {/* Global toasts */}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

        {children}
      </body>
    </html>
  )
}
