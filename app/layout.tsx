import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'GoToLinks - Your Wellness-Branded Link in Bio',
  description: 'A beautiful, mobile-first SaaS for wellness facilitators, retreat organizers, and venue owners to create branded link-in-bio profiles.',
  icons: {
    icon: '/Untitled_design__1_-removebg-preview.png',
    apple: '/Untitled_design__1_-removebg-preview.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}
