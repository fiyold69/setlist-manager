export function SetlistCardSkeleton() {
  return (
    <div className="block bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-100 dark:bg-gray-600 rounded mt-2" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-14 bg-gray-100 dark:bg-gray-600 rounded-full" />
          <div className="h-6 w-14 bg-gray-100 dark:bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function TrackRowSkeleton() {
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="w-5 h-4 bg-gray-100 dark:bg-gray-600 rounded shrink-0" />
      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full shrink-0" />
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-600 rounded mt-2" />
      </div>
      <div className="h-6 w-16 bg-gray-100 dark:bg-gray-600 rounded-lg shrink-0" />
    </div>
  )
}
