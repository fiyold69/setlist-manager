'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TrackRow from '@/components/TrackRow'

type Track = {
  id: string
  title: string
  artist: string | null
  bpm: number | null
  key: string | null
  image_url: string | null
  preview_url: string | null
  position: number
}

export default function SortableTrackRow({
  track,
  onDelete,
  onUpdate,
}: {
  track: Track
  onDelete: (id: string) => void
  onUpdate: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <TrackRow
        track={track}
        onDelete={onDelete}
        onUpdate={onUpdate}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}
