import type { Metadata } from 'next'
import { Sora, DM_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const sora = Sora({ 
  subsets: ["latin"],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600']
});

const dmMono = DM_Mono({ 
  subsets: ["latin"],
  variable: '--font-dm-mono',
  weight: ['400', '500']
});

export const metadata: Metadata = {
  title: 'BizAI Pro — Smart Business Decision System',
  description: 'AI-powered business advisor that analyzes sales data, understands demand, and suggests optimal decisions',
  generator: 'v0.app',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${sora.variable} ${dmMono.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
