'use client'
import { useState } from 'react';
import PreviewButton from '@/components/PreviewButton'

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

export default function TrackRow({
  track,
  onDelete,
  onUpdate,
  dragHandleProps,
}: {
  track: Track
  onDelete: (id: string) => void
  onUpdate: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}) {
  const [editing, setEditing] = useState(false)
  const [bpm, setBPM] = useState(track.bpm?.toString() ?? '')
  const [key, setKey] = useState(track.key ?? '')

  async function handleSave() {
    await fetch(`/api/tracks/${track.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bpm: bpm ? Number(bpm) : null,
        key: key || null,
      }),
    })
    setEditing(false)
    onUpdate()
  }

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-700 hover:shadow-sm transition-all duration-200">
      <div
        className="text-gray-300 dark:text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing px-1 shrink-0 select-none"
        style={{ touchAction: 'none' }}
        {...dragHandleProps}
      >
        ⠿
      </div>
      <span className="text-sm text-gray-300 dark:text-gray-600 w-5 text-center shrink-0">
        {track.position}
      </span>

      <PreviewButton url={track.preview_url} />

      {track.image_url ? (
        <img
          src={track.image_url}
          alt=""
          className="w-10 h-10 rounded-lg object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
          {track.title}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{track.artist}</p>
      </div>

      {editing ? (
        <div className="flex items-center gap-2 shrink-0">
          <input
            value={bpm}
            onChange={e => setBPM(e.target.value)}
            placeholder="BPM"
            type="number"
            className="w-16 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-400"
          />
          <input
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="Key"
            className="w-14 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-400"
          />
          <button
            type="button"
            onClick={handleSave}
            className="text-emerald-600 hover:bg-emerald-50 text-xs font-medium px-2 py-1 rounded-lg transition-colors"
          >
            保存
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 shrink-0 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded-lg transition-colors"
        >
          {track.bpm && (
            <span className="text-xs text-gray-600 dark:text-gray-300">{track.bpm} BPM</span>
          )}
          {track.key && (
            <span className="text-xs bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">
              {track.key}
            </span>
          )}
          {!track.bpm && !track.key && (
            <span className="text-xs text-gray-300 dark:text-gray-600">+ BPM/Key</span>
          )}
        </button>
      )}

      <button
        type="button"
        onClick={() => onDelete(track.id)}
        className="text-gray-300 hover:text-red-500 text-sm px-2 shrink-0 transition-colors"
      >
        ✕
      </button>
    </div>
  )
}
