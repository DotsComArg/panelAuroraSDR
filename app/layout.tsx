import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Aurora SDR',
  description: 'Dashboard de Aurora SDR - Sistema de Monitoreo e Inteligencia Artificial',
  generator: 'Aurora SDR',
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/favicon-32x32.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log('[ROOT LAYOUT] Rendering')
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
