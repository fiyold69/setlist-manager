import { getToken } from '@/lib/spotify'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return Response.json({ error: 'No code provided' }, { status: 400 })
  }

  // SpotifyのトークンをAPIから取得
  const tokenData = await getToken(code)

  // ログイン中のユーザーを取得
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // トークンをDBに保存（すでにあれば上書き）
    await supabase.from('spotify_tokens').upsert({
      user_id: user.id,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
    })
  }

  return Response.redirect('http://127.0.0.1:3000')
}
