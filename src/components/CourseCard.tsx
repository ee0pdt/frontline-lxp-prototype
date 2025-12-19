import type { Course } from '../store'
import { useCourseObjectCount } from '../hooks/useCourseObjectCount'

interface CourseCardProps {
  course: Course
  onContinue?: () => void
}

export function CourseCard({ course, onContinue }: CourseCardProps) {
  const { data: objectCount, isLoading: objectsLoading } = useCourseObjectCount(
    course.id,
    course.levelId
  )

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

  const getButtonClass = () => {
    if (course.isOverdue) return 'btn-urgent'
    if (daysUntilDue !== null && daysUntilDue <= 3) return 'btn-primary'
    return 'btn-subtle'
  }

  return (
    <div
      className={`card overflow-hidden ${course.isOverdue ? 'card-overdue' : ''}`}
    >
      <div className="flex gap-3">
        {/* Course image */}
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">📖</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Title and due date */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-[var(--text-primary)] text-[15px] leading-tight truncate">{course.title}</h3>
            {dueLabel && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${dueLabel.color}`}>
                {dueLabel.text}
              </span>
            )}
          </div>

          {/* Progress bar or object count */}
          {course.progress > 0 ? (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-[var(--progress-bg)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <span className="text-xs font-bold text-[var(--text-tertiary)] w-9 text-right">
                {course.progress}%
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-2">
              <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-xs text-[var(--text-muted)]">
                {objectsLoading ? '...' : `${objectCount ?? 1} item${(objectCount ?? 1) !== 1 ? 's' : ''}`}
              </span>
            </div>
          )}

          {/* Time estimate */}
          {course.estimatedMinutes && (
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{course.estimatedMinutes} min</span>
            </p>
          )}
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={onContinue}
        className={`w-full mt-3 text-sm py-3 ${getButtonClass()}`}
      >
        {course.progress > 0 ? 'Continue' : 'Start'}
      </button>
    </div>
  )
}
