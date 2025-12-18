import type { Course } from '../store'

interface CourseCardProps {
  course: Course
  onContinue?: () => void
}

export function CourseCard({ course, onContinue }: CourseCardProps) {
  const daysUntilDue = course.dueDate
    ? Math.ceil((new Date(course.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const getDueLabel = () => {
    if (!daysUntilDue) return null
    if (course.isOverdue) return { text: 'Overdue', color: 'bg-[var(--alert-danger-bg)] text-red-500 border border-[var(--alert-danger-border)]' }
    if (daysUntilDue <= 1) return { text: 'Due today', color: 'bg-[var(--alert-warning-bg)] text-orange-500 border border-[var(--alert-warning-border)]' }
    if (daysUntilDue <= 3) return { text: `${daysUntilDue}d left`, color: 'bg-[var(--alert-warning-bg)] text-amber-600 border border-[var(--alert-warning-border)]' }
    return { text: `${daysUntilDue}d left`, color: 'bg-[var(--surface-tertiary)] text-[var(--text-tertiary)]' }
  }

  const dueLabel = getDueLabel()

  return (
    <div
      className={`card overflow-hidden ${course.isOverdue ? 'ring-2 ring-red-400/50' : ''}`}
    >
      <div className="flex gap-4">
        {/* Course image */}
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">📖</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Title and due date */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-[var(--text-primary)] text-[15px] leading-tight line-clamp-2">{course.title}</h3>
            {dueLabel && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${dueLabel.color}`}>
                {dueLabel.text}
              </span>
            )}
          </div>

          {/* Progress section with improved padding */}
          <div className="bg-[var(--surface-tertiary)] rounded-lg p-3 mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--text-tertiary)]">Progress</span>
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {course.progress}%
              </span>
            </div>
            <div className="h-2 bg-[var(--progress-bg)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          {/* Time estimate */}
          {course.estimatedMinutes && (
            <p className="text-[11px] text-[var(--text-muted)] mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{course.estimatedMinutes} min remaining</span>
            </p>
          )}
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={onContinue}
        className="w-full mt-4 btn-primary text-sm py-3"
      >
        {course.progress > 0 ? 'Continue' : 'Start'}
      </button>
    </div>
  )
}
