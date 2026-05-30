'use client'
import { useState } from 'react'
import PreviewButton from '@/components/PreviewButton'
import { useToast } from '@/context/ToastContext'

type SearchResult = {
  spotify_id: string | null
  title: string
  artist: string
  album: string
  image_url: string | null
  preview_url: string | null
}

export default function TrackSearch({
  setlistId,
  onAdded,
}: {
  setlistId: string
  onAdded: () => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const { showToast } = useToast()

  async function handleSearch() {
    if (!query.trim()) return
    setSearching(true)
    const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    if (Array.isArray(data)) setResults(data)
    setSearching(false)
  }

  async function handleAdd(track: SearchResult) {
    const res = await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setlist_id: setlistId,
        title: track.title,
        artist: track.artist,
        bpm: null,
        key: null,
        spotify_id: track.spotify_id,
        preview_url: track.preview_url,
        image_url: track.image_url,
      }),
    })

    if (res.ok) {
      showToast(`「${track.title}」を追加しました`)
      onAdded()        // 親に「追加したよ」と伝えて一覧を再取得させる
    } else {
      showToast('追加に失敗しました', 'error')
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          placeholder="曲名・アーティストで検索"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
          autoFocus
        />
        <button
          type="button"
          onClick={handleSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 rounded-xl transition-colors"
        >
          検索
        </button>
      </div>

      {searching && (
        <p className="text-center text-gray-400 text-sm py-4">検索中...</p>
      )}

      <div className="flex flex-col gap-2">
        {results.map((track) => (
          <div
            key={track.spotify_id ?? track.preview_url ?? track.title}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {/* 試聴ボタンを追加 */}
            <PreviewButton url={track.preview_url} />

            {track.image_url ? (
              <img
                src={track.image_url}
                alt=""
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-100" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {track.title}
              </p>
              <p className="text-xs text-gray-400 truncate">{track.artist}</p>
            </div>
            <button
              type="button"
              onClick={() => handleAdd(track)}
              className="text-indigo-600 hover:bg-indigo-50 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              + 追加
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
