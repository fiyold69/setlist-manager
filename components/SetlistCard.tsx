'use client'
import Link from 'next/link'

type Setlist = {
  id: string
  title: string
  genre: string | null
  is_public: boolean
  tracks: { count: number }[]
}

export default function SetlistCard({ setlist }: { setlist: Setlist }) {
  const trackCount = setlist.tracks?.[0]?.count ?? 0

  return (
    <Link
      href={`/setlists/${setlist.id}`}
      className="block bg-white rounded-2xl p-5 border border-gray-100 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{setlist.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{trackCount} tracks</p>
        </div>
        <div className="flex gap-2">
          {setlist.genre && (
            <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
              {setlist.genre}
            </span>
          )}
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              setlist.is_public
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {setlist.is_public ? '公開中' : '非公開'}
          </span>
        </div>
      </div>
    </Link>
  )
}
