'use client'
import { useState, useEffect } from 'react'
import { getAuthUrl } from '@/lib/spotify'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [authUrl, setAuthUrl] = useState('')

  useEffect(() => {
    fetch('/api/spotify/auth-url')
      .then(res => res.json())
      .then(data => setAuthUrl(data.url))
  }, [])

  async function handleSignUp() {
    const res = await fetch('/api/auth/supabase/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setMessage(data.error ?? 'サインアップ成功！')
  }

  async function handleLogin() {
    const res = await fetch('/api/auth/supabase/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setMessage(data.error ?? 'ログイン成功！')
  }

  return (
    <main style={{ padding: 40 }}>
      {authUrl && <a href={authUrl}>Spotifyでログイン</a>}<br /><br />
      <input placeholder="email" value={email}
        onChange={e => setEmail(e.target.value)} /><br /><br />
      <input placeholder="password" type="password" value={password}
        onChange={e => setPassword(e.target.value)} /><br /><br />
      <button onClick={handleSignUp}>サインアップ</button>
      <button onClick={handleLogin} style={{ marginLeft: 8 }}>ログイン</button>
      <br /><br />
      <button
        type="button"
        onClick={async () => {
          const res = await fetch('/api/setlists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: 'テストセトリ',
              genre: 'Techno',
              is_public: false,
            }),
          })
          const data = await res.json()
          setMessage(JSON.stringify(data))
        }}
      >
        セットリスト作成
      </button>

      <button
        type="button"
        onClick={async () => {
          const res = await fetch('/api/setlists')
          const data = await res.json()
          setMessage(JSON.stringify(data))
        }}
        style={{ marginLeft: 8 }}
      >
        セットリスト取得
      </button>
      <button
        type="button"
        onClick={async () => {
          const res = await fetch('/api/tracks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              setlist_id: '15ac9ba2-510c-478b-b71e-56e36abb8780',
              title: 'Acid Rain',
              artist: 'Unknown',
              bpm: 132,
              key: 'Dm',
            }),
          })
          const data = await res.json()
          setMessage(JSON.stringify(data))
        }}
        style={{ marginLeft: 8 }}
      >
        トラック追加
      </button>
      <p>{message}</p>
    </main>
  )
}
