import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'ログインが必要です' }, { status: 401 })
  }

  const { updates } = await request.json() as { updates: { id: string; position: number }[] }
  const ids = updates.map(u => u.id)

  const { data: owned } = await supabase
    .from('tracks')
    .select('id, setlists!inner(user_id)')
    .in('id', ids)
    .eq('setlists.user_id', user.id)

  if (!owned || owned.length !== ids.length) {
    return Response.json({ error: '権限がありません' }, { status: 403 })
  }

  await Promise.all(
    updates.map(({ id, position }) =>
      supabase.from('tracks').update({ position }).eq('id', id)
    )
  )

  return new Response(null, { status: 204 })
}
