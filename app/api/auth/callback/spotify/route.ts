import { getToken } from '@/lib/spotify'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return Response.json({ error: 'No code provided' }, { status: 400 })
  }

  // 認証コードをアクセストークンに交換
  const tokenData = await getToken(code)

  // 取得できたか確認（後でSupabaseに保存する処理に置き換える）
  console.log('Token取得成功:', tokenData)

  // ホームにリダイレクト
  return Response.redirect('http://127.0.0.1:3000')
}
