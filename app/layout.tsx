import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CarDiagnostic - AI-Powered Vehicle Diagnostics',
  description: 'Advanced AI-powered car diagnostic tools for professionals and enthusiasts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
