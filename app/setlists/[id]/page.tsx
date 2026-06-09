'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TrackSearch from '@/components/TrackSearch'
import Modal from '@/components/Modal'
import ManualTrackForm from '@/components/ManualTrackForm'
import { TrackRowSkeleton } from '@/components/Skeleton'
import SortableTrackRow from '@/components/SortableTrackRow'
import { DndContext, closestCenter, type DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

type Track = {
  id: string
  title: string
  artist: string | null
  bpm: number | null
  key: string | null
  image_url: string | null
  preview_url: string | null
  position: number
}

type Setlist = {
  id: string
  title: string
  genre: string | null
  is_public: boolean
}

export default function SetlistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const setlistId = params.id as string

  const [setlist, setSetlist] = useState<Setlist | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [addMode, setAddMode] = useState<'search' | 'manual'>('search')

  const [searchOpen, setSearchOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editGenre, setEditGenre] = useState('')

  // セットリスト情報を取得
  async function fetchSetlist() {
    const res = await fetch('/api/setlists')
    const data = await res.json()
    if (Array.isArray(data)) {
      const found = data.find((s: Setlist) => s.id === setlistId)
      if (found) {
        setSetlist(found)
        setEditTitle(found.title)
        setEditGenre(found.genre ?? '')
      }
    }
  }

  // トラック一覧を取得
  async function fetchTracks() {
    const res = await fetch(`/api/tracks?setlist_id=${setlistId}`)
    const data = await res.json()
    if (Array.isArray(data)) setTracks(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchSetlist()
    fetchTracks()
  }, [setlistId])

  // タイトル・ジャンルを保存
  async function handleSaveInfo() {
    await fetch(`/api/setlists/${setlistId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, genre: editGenre }),
    })
    setEditing(false)
    fetchSetlist()
  }

  // 公開/非公開を切り替え
  async function togglePublic() {
    if (!setlist) return
    await fetch(`/api/setlists/${setlistId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_public: !setlist.is_public }),
    })
    fetchSetlist()
  }

  // セットリストを削除
  async function handleDeleteSetlist() {
    if (!confirm('このセットリストを削除しますか？')) return
    await fetch(`/api/setlists/${setlistId}`, { method: 'DELETE' })
    router.push('/')
  }

  async function handleDeleteTrack(id: string) {
    await fetch(`/api/tracks/${id}`, { method: 'DELETE' })
    fetchTracks()
  }

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = tracks.findIndex(t => t.id === active.id)
    const newIndex = tracks.findIndex(t => t.id === over.id)
    const reordered = arrayMove(tracks, oldIndex, newIndex)
    const withUpdatedPositions = reordered.map((t, i) => ({ ...t, position: i + 1 }))

    setTracks(withUpdatedPositions)

    await fetch('/api/tracks/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates: withUpdatedPositions.map(t => ({ id: t.id, position: t.position })),
      }),
    })
  }

  const bpmTracks = tracks.filter(t => t.bpm !== null)
  const avgBpm = bpmTracks.length > 0
    ? Math.round(bpmTracks.reduce((sum, t) => sum + t.bpm!, 0) / bpmTracks.length)
    : null

  if (!setlist) {
    return <p className="text-center text-gray-400 py-12">読み込み中...</p>
  }

  return (
    <div>
      <div className="mb-6">
        <a href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          ← 一覧に戻る
        </a>
      </div>

      {/* セットリスト情報カード */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-6">
        {editing ? (
          <div className="flex flex-col gap-3">
            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="セットリスト名"
              className="border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={editGenre}
              onChange={e => setEditGenre(e.target.value)}
              placeholder="ジャンル"
              className="border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveInfo}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-xl transition-colors"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium py-2 rounded-xl transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {setlist.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {setlist.genre && (
                    <span className="text-xs bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full">
                      {setlist.genre}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {tracks.length} tracks
                    {avgBpm !== null && (
                      <> · 平均 <span className="text-indigo-500 font-medium">{avgBpm} BPM</span></>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm transition-colors"
                  aria-label="編集"
                >
                  編集
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSetlist}
                  className="text-gray-400 hover:text-red-500 text-sm transition-colors"
                  aria-label="削除"
                >
                  削除
                </button>
              </div>
            </div>

            {/* 公開/非公開トグル */}
            <button
              type="button"
              onClick={togglePublic}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                setlist.is_public
                  ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {setlist.is_public ? '🌐 公開中（クリックで非公開に）' : '🔒 非公開（クリックで公開）'}
            </button>
          </div>
        )}
      </div>

      {/* 曲を追加ボタン */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all active:scale-95"
        >
          + 曲を追加
        </button>
      </div>

      {/* トラック一覧 */}
      {loading ? (
        <div className="flex flex-col gap-2">
          <TrackRowSkeleton />
          <TrackRowSkeleton />
          <TrackRowSkeleton />
          <TrackRowSkeleton />
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-12 text-gray-400 flex flex-col items-center gap-3">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-indigo-200 dark:text-indigo-800">
            <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">最初の曲を追加しよう</p>
            <p className="text-sm mt-1 dark:text-gray-500">iTunes検索か手動入力で追加できます</p>
          </div>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            + 曲を追加
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tracks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {tracks.map(track => (
                <SortableTrackRow
                  key={track.id}
                  track={track}
                  onDelete={handleDeleteTrack}
                  onUpdate={fetchTracks}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* 検索モーダル */}
      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="曲を追加"
      >
        {/* タブ切り替え */}
        <div className="flex border-b border-gray-100 dark:border-gray-700 mb-4 -mx-5 -mt-5 px-5">
          <button
            type="button"
            onClick={() => setAddMode('search')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              addMode === 'search'
                ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            iTunes検索
          </button>
          <button
            type="button"
            onClick={() => setAddMode('manual')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              addMode === 'manual'
                ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            手動で追加
          </button>
        </div>

        {addMode === 'search' ? (
          <TrackSearch setlistId={setlistId} onAdded={fetchTracks} />
        ) : (
          <ManualTrackForm setlistId={setlistId} onAdded={fetchTracks} />
        )}
      </Modal>
    </div>
  )
}
