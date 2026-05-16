'use client'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

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
      <input placeholder="email" value={email}
        onChange={e => setEmail(e.target.value)} /><br /><br />
      <input placeholder="password" type="password" value={password}
        onChange={e => setPassword(e.target.value)} /><br /><br />
      <button onClick={handleSignUp}>サインアップ</button>
      <button onClick={handleLogin} style={{ marginLeft: 8 }}>ログイン</button>
      <p>{message}</p>
    </main>
  )
}
