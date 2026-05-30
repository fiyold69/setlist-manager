import { createServerSupabaseClient } from '@/lib/supabase-server'

// トラックを更新する（Update）
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
  const body = await request.json()

  const { data, error } = await supabase
    .from('tracks')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json(data)
}

// トラックを削除する（Delete）
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

  const { data: track } = await supabase
    .from('tracks')
    .select('setlist_id')
    .eq('id', id)
    .single()

  if (!track) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('tracks')
    .delete()
    .eq('id', id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  const { data: remaining } = await supabase
    .from('tracks')
    .select('id')
    .eq('setlist_id', track.setlist_id)
    .order('position', { ascending: true })

  if (remaining) {
    await Promise.all(
      remaining.map((t, i) =>
        supabase
          .from('tracks')
          .update({ position: i + 1 })
          .eq('id', t.id)
      )
    )
  }

  return new Response(null, { status: 204 })
}
