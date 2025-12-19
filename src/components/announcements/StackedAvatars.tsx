import type { Announcement } from '../../store'

interface StackedAvatarsProps {
  announcements: Announcement[]
  onClick: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function StackedAvatars({ announcements, onClick }: StackedAvatarsProps) {
  if (announcements.length === 0) {
    return null
  }

  // Get unique creators (max 3)
  const creators = announcements
    .slice(0, 3)
    .map((a) => a.createdBy)
    .filter((creator, index, self) =>
      index === self.findIndex((c) => c.id === creator.id)
    )
    .slice(0, 3)

  return (
    <button
      onClick={onClick}
      className="flex items-center -space-x-2 group story-pulse"
      aria-label={`${announcements.length} new announcements`}
    >
      {creators.map((creator, index) => (
        <div
          key={creator.id}
          className="story-avatar-ring p-[2px] rounded-full transition-transform group-hover:scale-105"
          style={{ zIndex: creators.length - index }}
        >
          {creator.avatar ? (
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-6 h-6 rounded-full object-cover border-2 border-[var(--surface-primary)]"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-bold text-[10px] border-2 border-[var(--surface-primary)]">
              {getInitials(creator.name)}
            </div>
          )}
        </div>
      ))}
      {announcements.length > 1 && (
        <span className="ml-1 text-xs font-semibold text-[var(--color-accent)]">
          {announcements.length}
        </span>
      )}
    </button>
  )
}
