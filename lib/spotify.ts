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

// アクセストークンをDBから取得してリフレッシュする関数
export async function getValidAccessToken(userId: string, supabase: any) {
  const { data: tokenData } = await supabase
    .from('spotify_tokens')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!tokenData) return null

  // トークンの有効期限が切れていたらリフレッシュ
  if (new Date(tokenData.expires_at) < new Date()) {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokenData.refresh_token,
      }),
    })
    const refreshed = await res.json()

    // 新しいトークンをDBに保存
    await supabase
      .from('spotify_tokens')
      .update({
        access_token: refreshed.access_token,
        expires_at: new Date(Date.now() + refreshed.expires_in * 1000),
      })
      .eq('user_id', userId)

    return refreshed.access_token
  }

  return tokenData.access_token
}

// 曲を検索する関数（既存のものを置き換え）
export async function searchTracks(query: string, accessToken: string) {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  /*
  const data = await res.json()

  // 必要な情報だけ整形して返す
  return data.tracks.items.map((track: any) => ({
    spotify_id: track.id,
    title: track.name,
    artist: track.artists.map((a: any) => a.name).join(', '),
    album: track.album.name,
    image_url: track.album.images[1]?.url,  // アルバムアート
    preview_url: track.preview_url,          // 試聴URL（30秒）
  }))*/

  // レスポンスの中身をそのままログに出す
  const text = await res.text()
  console.log('Spotify response status:', res.status)
  console.log('Spotify response body:', text)

  if (!res.ok) {
    throw new Error(`Spotify API error: ${text}`)
  }

  const data = JSON.parse(text)
  return data.tracks.items.map((track: any) => ({
    spotify_id: track.id,
    title: track.name,
    artist: track.artists.map((a: any) => a.name).join(', '),
    album: track.album.name,
    image_url: track.album.images[1]?.url,
    preview_url: track.preview_url,
  }))
}
