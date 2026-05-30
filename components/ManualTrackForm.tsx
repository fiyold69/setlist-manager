'use client'
import { useState } from 'react'
import { useToast } from '@/context/ToastContext'

export default function ManualTrackForm({
  setlistId,
  onAdded,
}: {
  setlistId: string
  onAdded: () => void
}) {
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [bpm, setBpm] = useState('')
  const [key, setKey] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!title.trim()) {
      showToast('曲名を入力してください', 'error')
      return
    }

    setSubmitting(true)
    const res = await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setlist_id: setlistId,
        title,
        artist: artist || null,
        bpm: bpm ? Number(bpm) : null,
        key: key || null,
        spotify_id: null,
        preview_url: null,
        image_url: null,
      }),
    })

    if (res.ok) {
      showToast(`「${title}」を追加しました`)
      // フォームをリセット
      setTitle('')
      setArtist('')
      setBpm('')
      setKey('')
      onAdded()
    } else {
      showToast('追加に失敗しました', 'error')
    }
    setSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-400">
        iTunesにない曲（Remix・Bootleg等）を手動で追加できます
      </p>
      <input
        placeholder="曲名 *"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
      />
      <input
        placeholder="アーティスト"
        value={artist}
        onChange={e => setArtist(e.target.value)}
        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
      />
      <div className="flex gap-2">
        <input
          placeholder="BPM"
          value={bpm}
          onChange={e => setBpm(e.target.value)}
          type="number"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
        />
        <input
          placeholder="Key（Am, F#m...）"
          value={key}
          onChange={e => setKey(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
      >
        {submitting ? '追加中...' : '追加する'}
      </button>
    </div>
  )
}
