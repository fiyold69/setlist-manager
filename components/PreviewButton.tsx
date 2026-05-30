'use client'
import { useAudioPlayer } from '@/context/AudioContext'

export default function PreviewButton({ url }: { url: string | null }) {
  const { currentUrl, play, stop } = useAudioPlayer()

  if (!url) {
    return <span className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
  }

  // このボタンの曲が再生中かどうか
  const isPlaying = currentUrl === url

  function toggle() {
    if (isPlaying) {
      stop()
    } else {
      play(url!)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 transition-colors"
      aria-label={isPlaying ? '停止' : '再生'}
    >
      {isPlaying ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <rect x="2" y="2" width="8" height="8" rx="1" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3 2l7 4-7 4z" />
        </svg>
      )}
    </button>
  )
}
