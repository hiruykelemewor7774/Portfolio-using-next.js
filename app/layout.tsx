import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { OfflineStatus } from './offline-status'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Alemu Kelemework — Developer Portfolio',
  description: 'Portfolio of Alemu Kelemework, a full-stack developer and Computer Science student building thoughtful digital experiences.',
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Alemu Kelemework — Developer Portfolio',
    description: 'Full-stack developer portfolio and project work by Alemu Kelemework.',
    url: siteUrl,
    siteName: 'Alemu Kelemework',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alemu Kelemework — Developer Portfolio',
    description: 'Full-stack developer portfolio and project work by Alemu Kelemework.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <OfflineStatus />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
