import { useRef, useCallback } from 'react'
import { useStore } from '../../store'
import { StoryIndicators } from './StoryIndicators'
import { AnnouncementSlide } from './AnnouncementSlide'

export function AnnouncementOverlay() {
  const {
    announcements,
    dismissedAnnouncementIds,
    announcementIndex,
    setAnnouncementIndex,
    closeAnnouncementOverlay,
    dismissAnnouncement,
  } = useStore()

  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  // Filter out dismissed announcements
  const activeAnnouncements = announcements.filter(
    (a) => !dismissedAnnouncementIds.includes(a.id)
  )

  const currentAnnouncement = activeAnnouncements[announcementIndex]

  const navigateNext = useCallback(() => {
    if (announcementIndex < activeAnnouncements.length - 1) {
      setAnnouncementIndex(announcementIndex + 1)
    } else {
      // At the end, dismiss current and close
      if (currentAnnouncement) {
        dismissAnnouncement(currentAnnouncement.id)
      }
      closeAnnouncementOverlay()
    }
  }, [announcementIndex, activeAnnouncements.length, currentAnnouncement, setAnnouncementIndex, dismissAnnouncement, closeAnnouncementOverlay])

  const navigatePrev = useCallback(() => {
    if (announcementIndex > 0) {
      setAnnouncementIndex(announcementIndex - 1)
    }
  }, [announcementIndex, setAnnouncementIndex])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    const diffY = touchStartY.current - e.changedTouches[0].clientY

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        navigateNext()
      } else {
        navigatePrev()
      }
    }
  }

  const handleTapNavigation = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    // Tap left third = prev, right two-thirds = next
    if (x < width / 3) {
      navigatePrev()
    } else {
      navigateNext()
    }
  }

  const handleClose = () => {
    closeAnnouncementOverlay()
  }

  const handleDismissAll = () => {
    activeAnnouncements.forEach((a) => dismissAnnouncement(a.id))
    closeAnnouncementOverlay()
  }

  if (!currentAnnouncement) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-secondary-dark)] animate-scale-in flex justify-center">
      {/* Constrained width container for desktop */}
      <div className="w-full max-w-md flex flex-col">
        {/* Safe area padding top */}
        <div className="h-[env(safe-area-inset-top)]" />

        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          {/* Story indicators */}
          <StoryIndicators total={activeAnnouncements.length} current={announcementIndex} />

          {/* Close button */}
          <div className="flex justify-end mt-3">
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area with touch/tap handlers */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 120px)' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleTapNavigation}
        >
          <AnnouncementSlide announcement={currentAnnouncement} />
        </div>

        {/* Footer with navigation hints and dismiss all */}
        <div className="px-4 pb-4 mb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span>
              {announcementIndex + 1} of {activeAnnouncements.length}
            </span>
            <button
              onClick={handleDismissAll}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              Dismiss all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
