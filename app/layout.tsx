import type { Metadata } from 'next'
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google'
import { PersonJsonLd } from '@/components/layout/PersonJsonLd'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
})
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tanialapalelo.vercel.app'),
  title: 'Tania Lapalelo - Frontend Engineer',
  description:
    'Frontend engineer with 5 years of production experience building full-stack systems with Next.js, NestJS, TypeScript, and PostgreSQL.',
  openGraph: {
    title: 'Tania Lapalelo',
    description:
      'Frontend engineer with 5 years of production experience.',
    url: 'https://tanialapalelo.vercel.app',
    siteName: 'Tania Lapalelo',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tania Lapalelo',
    description: 'Frontend engineer with 5 years of production experience.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen bg-bg font-body text-ink antialiased">
        <PersonJsonLd />
        {children}
      </body>
    </html>
  )
}
