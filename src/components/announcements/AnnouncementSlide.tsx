import type { Announcement } from '../../store'

interface AnnouncementSlideProps {
  announcement: Announcement
  onCtaClick?: () => void
}

function getTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function AnnouncementSlide({ announcement, onCtaClick }: AnnouncementSlideProps) {
  const { title, body, imageUrl, ctaText, ctaUrl, createdAt, createdBy } = announcement

  return (
    <div className="flex flex-col h-full px-4 py-6">
      {/* Hero image */}
      {imageUrl && (
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 flex-shrink-0">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
          {title}
        </h2>
        <p className="text-white/80 text-base leading-relaxed flex-1">
          {body}
        </p>

        {/* CTA Button */}
        {ctaText && (
          <button
            onClick={() => {
              if (ctaUrl && ctaUrl !== '#') {
                window.open(ctaUrl, '_blank')
              }
              onCtaClick?.()
            }}
            className="mt-6 w-full py-3 px-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
          >
            {ctaText}
          </button>
        )}
      </div>

      {/* Creator info */}
      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/20">
        {createdBy.avatar ? (
          <img
            src={createdBy.avatar}
            alt={createdBy.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
            {getInitials(createdBy.name)}
          </div>
        )}
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{createdBy.name}</p>
          <p className="text-white/60 text-xs">{getTimeAgo(createdAt)}</p>
        </div>
      </div>
    </div>
  )
}
