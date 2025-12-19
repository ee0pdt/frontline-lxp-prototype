interface NewAnnouncementsBannerProps {
  count: number
  onView: () => void
  onDismiss: () => void
}

export function NewAnnouncementsBanner({ count, onView, onDismiss }: NewAnnouncementsBannerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="relative bg-gradient-to-br from-[var(--color-accent)] via-[#9B5DE5] to-[var(--color-secondary)] p-8 rounded-3xl shadow-2xl max-w-xs mx-4 text-center animate-scale-in">
        {/* Dismiss X button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Megaphone/announcement icon */}
        <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 3.94a.75.75 0 011.16.88l-2.33 4.2h5.67l-2.33-4.2a.75.75 0 011.16-.88L18 8.25h2.25a.75.75 0 01.75.75v6a.75.75 0 01-.75.75H18l-4.33 4.41a.75.75 0 01-1.16-.88l2.33-4.2H9.17l2.33 4.2a.75.75 0 01-1.16.88L6 15.75H3.75a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75H6l4.34-4.31z" />
          </svg>
        </div>

        {/* Badge with count */}
        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full mb-4">
          <span className="w-6 h-6 bg-white text-[var(--color-accent)] rounded-full flex items-center justify-center text-sm font-bold">
            {count}
          </span>
          <span className="text-white font-semibold text-sm">New</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2">
          New Announcements
        </h2>
        <p className="text-white/80 text-sm mb-6">
          You have {count === 1 ? 'a new announcement' : `${count} new announcements`} to read
        </p>

        {/* View button */}
        <button
          onClick={onView}
          className="w-full py-3 px-6 bg-white text-[var(--color-accent)] font-bold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg"
        >
          View {count === 1 ? 'Announcement' : 'Announcements'}
        </button>
      </div>
    </div>
  )
}
