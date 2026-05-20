import { createServerSupabaseClient } from '@/lib/supabase-server'
import { searchTracks } from '@/lib/itunes'

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'ログインが必要です' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return Response.json({ error: 'クエリが必要です' }, { status: 400 })
  }

  const tracks = await searchTracks(query)
  return Response.json(tracks)
}
