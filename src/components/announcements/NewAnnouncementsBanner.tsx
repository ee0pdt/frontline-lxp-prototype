interface NewAnnouncementsBannerProps {
  count: number
  onView: () => void
  onDismiss: () => void
}

export function NewAnnouncementsBanner({ count, onView, onDismiss }: NewAnnouncementsBannerProps) {
  return (
    <div className="relative bg-gradient-to-r from-[var(--color-accent)] via-[#9B5DE5] to-[var(--color-secondary)] p-4 rounded-2xl shadow-lg overflow-hidden">
      {/* Decorative shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-white font-bold text-sm">New Announcements</span>
            <span className="w-5 h-5 bg-white text-[var(--color-accent)] rounded-full flex items-center justify-center text-xs font-bold">
              {count}
            </span>
          </div>
          <p className="text-white/80 text-xs">
            {count === 1 ? 'You have a new announcement' : `You have ${count} new announcements`}
          </p>
        </div>

        {/* View button */}
        <button
          onClick={onView}
          className="px-4 py-2 bg-white text-[var(--color-accent)] font-bold text-sm rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-md flex-shrink-0"
        >
          View
        </button>

        {/* Dismiss X button */}
        <button
          onClick={onDismiss}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
