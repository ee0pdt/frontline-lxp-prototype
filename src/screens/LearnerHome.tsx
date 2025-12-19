import { useEffect } from 'react'
import { useStore } from '../store'
import type { Course } from '../store'
import { api } from '../api/client'
import { DailyGoal } from '../components/DailyGoal'
import { CourseCard } from '../components/CourseCard'

export function LearnerHome() {
  const {
    user,
    mandatoryLearning,
    setMandatoryLearning,
    setIsLoading,
    setActiveCourse,
    setCurrentScreen,
  } = useStore()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const mandatory = await api.getMandatoryLearning()
        setMandatoryLearning(mandatory)
      } catch (error) {
        console.error('Failed to load learning data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [setMandatoryLearning, setIsLoading])

  const handleContinue = (course: Course) => {
    setActiveCourse(course)
    setCurrentScreen('course-content')
  }

  const overdueCount = mandatoryLearning.filter((c) => c.isOverdue).length

  return (
    <div className="flex-1 flex flex-col bg-[var(--surface-secondary)]">
      {/* Compact Header */}
      <div className="bg-[var(--surface-primary)] px-4 py-3 border-b border-[var(--border-primary)] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)]">
              Hi, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Ready to learn something new?
            </p>
          </div>
          {/* User avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white font-bold text-sm">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto bg-[var(--surface-secondary)]">
        <div className="px-4 py-4 pb-24 space-y-4 stagger-fade-in">
          {/* Daily Goal Section */}
          <DailyGoal />

          {/* Overdue Alert */}
          {overdueCount > 0 && (
            <div className="bg-[var(--alert-danger-bg)] border-l-4 border-red-500 p-3 rounded-r-xl animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-red-600 text-sm">
                    {overdueCount} overdue {overdueCount === 1 ? 'course' : 'courses'}
                  </p>
                  <p className="text-xs text-red-500/80">Complete to stay compliant</p>
                </div>
              </div>
            </div>
          )}

          {/* Mandatory Learning Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[var(--text-primary)]">Required Training</h2>
              <span className="text-xs text-[var(--text-muted)] bg-[var(--surface-tertiary)] px-2 py-1 rounded-full font-semibold">
                {mandatoryLearning.filter((c) => c.progress === 100).length}/{mandatoryLearning.length}
              </span>
            </div>

            <div className="space-y-3">
              {mandatoryLearning.length === 0 ? (
                <div className="card text-center py-8">
                  <span className="text-4xl mb-3 block">🎉</span>
                  <p className="font-bold text-[var(--text-primary)]">All caught up!</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    No mandatory training right now
                  </p>
                </div>
              ) : (
                mandatoryLearning.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onContinue={() => handleContinue(course)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Quick action */}
          <button className="w-full card-interactive card bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary-light)] text-white p-4 text-left border-0 shadow-lg overflow-hidden relative group">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="flex items-center gap-4 relative">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-inner">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base">Quick Boost</h3>
                <p className="text-sm opacity-90">Earn 10 XP with a 2-min micro-lesson</p>
              </div>
              <svg className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
