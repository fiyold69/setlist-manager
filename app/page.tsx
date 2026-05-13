// app/page.tsx
import { getAuthUrl } from '@/lib/spotify'

export default function Home() {
  return (
    <main>
      <a href={getAuthUrl()}>Spotifyでログイン</a>
    </main>
  )
}
