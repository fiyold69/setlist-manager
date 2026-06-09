import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { AudioPlayerProvider } from '@/context/AudioContext'
import Navbar from '@/components/Navbar'
import { ToastProvider } from '@/context/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Setlist Manager',
  description: 'DJ setlist management app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-surface dark:bg-gray-900 min-h-screen`}>
        <AuthProvider>
          <AudioPlayerProvider>
            <ToastProvider>
              <Navbar />
              <main className="max-w-2x1 mx-auto px-4 py-8">
                {children}
              </main>
            </ToastProvider>
          </AudioPlayerProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
