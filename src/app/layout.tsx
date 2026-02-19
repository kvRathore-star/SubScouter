import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono, Outfit } from 'next/font/google'
import { TooltipProvider } from "@/components/ui/tooltip"
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sub Scouter — Smart Subscription Tracker',
  description: 'Track, manage, and optimize all your subscriptions in one place. AI-powered inbox scanning. 100% private.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sub Scouter',
  },
  openGraph: {
    title: 'Sub Scouter — Never Overpay for Subscriptions Again',
    description: 'AI scans your inbox to find hidden subscriptions. Track spending, get renewal alerts, and cancel what you don\'t use.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f7ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} ${outfit.variable} font-sans`}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
