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
    if (course.isOverdue) return { text: 'Overdue', color: 'bg-red-100 text-red-600' }
    if (daysUntilDue <= 1) return { text: 'Due today', color: 'bg-orange-100 text-orange-600' }
    if (daysUntilDue <= 3) return { text: `${daysUntilDue} days left`, color: 'bg-amber-100 text-amber-600' }
    return { text: `${daysUntilDue} days left`, color: 'bg-gray-100 text-gray-600' }
  }

  const dueLabel = getDueLabel()

  return (
    <div className={`card overflow-hidden ${course.isOverdue ? 'ring-2 ring-red-300' : ''}`}>
      <div className="flex gap-4">
        {/* Course image placeholder */}
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[var(--color-duo-green-light)] to-[var(--color-duo-green)] flex items-center justify-center flex-shrink-0">
          <span className="text-3xl">📖</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title and due date */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-700 truncate">{course.title}</h3>
            {dueLabel && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${dueLabel.color}`}>
                {dueLabel.text}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 line-clamp-1 mb-2">{course.description}</p>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-duo-green)] rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-500 w-12 text-right">
              {course.progress}%
            </span>
          </div>

          {/* Time estimate */}
          {course.estimatedMinutes && (
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <span>⏱</span>
              <span>{course.estimatedMinutes} min</span>
            </p>
          )}
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={onContinue}
        className="w-full mt-4 btn-primary text-sm"
      >
        {course.progress > 0 ? 'Continue' : 'Start'}
      </button>
    </div>
  )
}
