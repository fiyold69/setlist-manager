'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import SetlistCard from '@/components/SetlistCard'
import { SetlistCardSkeleton } from '@/components/Skeleton'

type Setlist = {
  id: string
  title: string
  genre: string | null
  is_public: boolean
  tracks: { count: number }[]
}

export default function HomePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [setlists, setSetlists] = useState<Setlist[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')

  // 未ログインならログイン画面へ
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // セットリスト一覧を取得
  async function fetchSetlists() {
    const res = await fetch('/api/setlists')
    const data = await res.json()
    if (Array.isArray(data)) {
      setSetlists(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchSetlists()
  }, [user])

  // 新規作成
  async function handleCreate() {
    if (!title.trim()) return
    const res = await fetch('/api/setlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, genre, is_public: false }),
    })
    if (res.ok) {
      setTitle('')
      setGenre('')
      setShowForm(false)
      fetchSetlists()
    }
  }

  if (authLoading) {
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Setlists</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all active:scale-95"
        >
          {showForm ? 'キャンセル' : '+ 新規作成'}
        </button>
      </div>

      {/* 新規作成フォーム */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
          <div className="flex flex-col gap-3">
            <input
              placeholder="セットリスト名"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
            <input
              placeholder="ジャンル（例: Techno）"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
            <button
              type="button"
              onClick={handleCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-xl transition-all active:scale-95"
            >
              作成する
            </button>
          </div>
        </div>
      )}

      {/* 一覧 */}
      {loading ? (
        <div className="flex flex-col gap-3">
          <SetlistCardSkeleton />
          <SetlistCardSkeleton />
          <SetlistCardSkeleton />
        </div>
      ) : setlists.length === 0 ? (
        <div className="text-center py-16 text-gray-400 flex flex-col items-center gap-3">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="text-indigo-200">
            <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <div>
            <p className="text-gray-600 font-medium">最初のセットリストを作成しよう</p>
            <p className="text-sm mt-1">あなたのDJセットを記録・管理できます</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            + セットリストを作成
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {setlists.map(setlist => (
            <SetlistCard key={setlist.id} setlist={setlist} />
          ))}
        </div>
      )}
    </div>
  )
}
