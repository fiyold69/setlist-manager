import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'ログインが必要です' }, { status: 401 })
  }

  const { updates } = await request.json() as { updates: { id: string; position: number }[] }

  await Promise.all(
    updates.map(({ id, position }) =>
      supabase.from('tracks').update({ position }).eq('id', id)
    )
  )

  return new Response(null, { status: 204 })
}
