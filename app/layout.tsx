import type { Metadata } from 'next'
import './globals.css'
import './styles/responsive.css'

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
