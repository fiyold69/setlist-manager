const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!

// ログインURLを生成する関数
export function getAuthUrl() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: [
      'user-read-private',
      'user-read-email',
    ].join(' '),
  })
  return `https://accounts.spotify.com/authorize?${params}`
}

// 認証コードをトークンに交換する関数
export async function getToken(code: string) {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  })
  return res.json()
}

// 曲を検索する関数
export async function searchTracks(query: string, accessToken: string) {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  return res.json()
}
