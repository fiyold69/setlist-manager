import { getAuthUrl } from '@/lib/spotify'

export async function GET() {
  return Response.json({ url: getAuthUrl() })
}
