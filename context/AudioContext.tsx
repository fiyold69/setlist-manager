'use client'
import { createContext, useContext, useRef, useState } from 'react'

type AudioContextType = {
  currentUrl: string | null
  play: (url: string) => void
  stop: () => void
}

const AudioPlayerContext = createContext<AudioContextType>({
  currentUrl: null,
  play: () => {},
  stop: () => {},
})

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)

  async function play(url: string) {
    const prevAudio = audioRef.current
    const prevPromise = playPromiseRef.current

    // すでに鳴っている曲があれば止める
    if (prevAudio && prevPromise) {
      try { await prevPromise }
      catch {}
      prevAudio.pause()
    }

    // 新しい曲を再生
    const audio = new Audio(url)
    audio.onended = () => setCurrentUrl(null)
    // audio.play()
    audioRef.current = audio
    setCurrentUrl(url)

    playPromiseRef.current = audio.play().catch(() => {})
  }

  async function stop() {
    const audio = audioRef.current
    const promise = playPromiseRef.current

    if (audio && promise) {
      try { await promise }
      catch {}
      audio.pause()
    }
    audioRef.current = null
    playPromiseRef.current = null
    setCurrentUrl(null)
  }

  return (
    <AudioPlayerContext.Provider value={{ currentUrl, play, stop }}>
      {children}
    </AudioPlayerContext.Provider>
  )
}

export const useAudioPlayer = () => useContext(AudioPlayerContext)
