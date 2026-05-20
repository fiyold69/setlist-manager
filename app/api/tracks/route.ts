import { createServerSupabaseClient } from '@/lib/supabase-server'

// 特定のセットリストのトラック一覧を取得（Read）
export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'ログインが必要です' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const setlistId = searchParams.get('setlist_id')

  if (!setlistId) {
    return Response.json({ error: 'setlist_idが必要です' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('setlist_id', setlistId)
    .order('position', { ascending: true })  // position順に並べる

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json(data)
}

// トラックを追加する（Create）
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'ログインが必要です' }, { status: 401 })
  }

  const {
    setlist_id,
    title,
    artist,
    bpm,
    key,
    spotify_id,
    preview_url,
    image_url,
  } = await request.json()

  const { data: existing } = await supabase
    .from('tracks')
    .select('position')
    .eq('setlist_id', setlist_id)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  const nextPosition = existing ? existing.position + 1 : 1

  const { data, error } = await supabase
    .from('tracks')
    .insert({
      setlist_id,
      title,
      artist,
      bpm,
      key,
      spotify_id,
      preview_url,
      image_url,
      position: nextPosition,
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json(data, { status: 201 })
}
