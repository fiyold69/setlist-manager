import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
  return Response.json({ user: data.user })
}
