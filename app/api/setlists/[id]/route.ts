import { createServerSupabaseClient } from '@/lib/supabase-server'

// 特定のセットリストを更新する（Update）
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'ログインが必要です' }, { status: 401 })
  }

  const { id } = await params
  const { title, genre, is_public } = await request.json()

  const updates: Record<string, unknown> = {}
  if (title !== undefined) updates.title = title
  if (genre !== undefined) updates.genre = genre
  if (is_public !== undefined) updates.is_public = is_public

  const { data, error } = await supabase
    .from('setlists')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)   // 自分のセットリストだけ更新できる
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json(data)
}

// 特定のセットリストを削除する（Delete）
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'ログインが必要です' }, { status: 401 })
  }

  const { id } = await params

  const { error } = await supabase
    .from('setlists')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return new Response(null, { status: 204 })
}
