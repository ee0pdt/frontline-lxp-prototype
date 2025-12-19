import { useStore } from '../store'

export function ProgressScreen() {
  const { streak, dailyGoal, mandatoryLearning } = useStore()

  const completedCourses = mandatoryLearning.filter(c => c.progress === 100)
  const totalXP = dailyGoal.currentXP

  return (
    <div className="flex-1 flex flex-col bg-[var(--surface-secondary)]">
      {/* Header */}
      <div className="bg-[var(--surface-primary)] px-4 py-3 border-b border-[var(--border-primary)] flex-shrink-0">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Progress</h1>
        <p className="text-xs text-[var(--text-muted)]">Your achievements and journey</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center py-3">
            <span className="text-2xl font-bold text-[var(--color-primary)]">{streak.current}</span>
            <p className="text-xs text-[var(--text-muted)] mt-1">Day Streak</p>
          </div>
          <div className="card text-center py-3">
            <span className="text-2xl font-bold text-[var(--color-primary)]">{completedCourses.length}</span>
            <p className="text-xs text-[var(--text-muted)] mt-1">Completed</p>
          </div>
          <div className="card text-center py-3">
            <span className="text-2xl font-bold text-[var(--color-primary)]">{totalXP}</span>
            <p className="text-xs text-[var(--text-muted)] mt-1">XP Today</p>
          </div>
        </div>

        {/* Completed Courses */}
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">Completed Courses</h2>
          {completedCourses.length === 0 ? (
            <div className="card text-center py-8">
              <span className="text-3xl mb-2 block">📚</span>
              <p className="text-sm text-[var(--text-muted)]">
                Complete courses to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {completedCourses.map((course) => (
                <div key={course.id} className="card flex items-center gap-3">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📖</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] text-sm truncate">{course.title}</h3>
                    <p className="text-xs text-[var(--text-muted)]">Completed</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges placeholder */}
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">Achievements</h2>
          <div className="card text-center py-8">
            <span className="text-3xl mb-2 block">🏆</span>
            <p className="text-sm text-[var(--text-muted)]">
              Badges and achievements coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
