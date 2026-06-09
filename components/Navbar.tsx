'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <Link href="/" className="text-primary font-semibold text-lg">
        Setlist Manager
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
            <button
              onClick={signOut}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
            >
              ログアウト
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm text-primary font-medium"
          >
            ログイン
          </Link>
        )}
      </div>
    </nav>
  )
}
