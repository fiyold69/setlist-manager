export async function searchTracks(query: string) {
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=10`
  )

  if (!res.ok) {
    throw new Error('iTunes API error')
  }

  const data = await res.json()

  return data.results.map((track: any) => ({
    spotify_id: null,
    title: track.trackName ?? '不明',
    artist: track.artistName ?? '不明',
    album: track.collectionName ?? '不明',
    image_url: track.artworkUrl100 ?? null,
    preview_url: track.previewUrl ?? null,
  }))
}
