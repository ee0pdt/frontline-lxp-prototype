import { useEffect } from 'react'
import { useStore } from '../store'
import { api } from '../api/client'
import { DailyGoal } from '../components/DailyGoal'
import { CourseCard } from '../components/CourseCard'

export function LearnerHome() {
  const { user, mandatoryLearning, setMandatoryLearning, setIsLoading, addXP } = useStore()

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

  const handleContinue = (courseId: number) => {
    // In a real app, this would launch the course
    console.log('Launching course:', courseId)
    // Simulate earning XP for demo purposes
    addXP(10)
  }

  const overdueCount = mandatoryLearning.filter((c) => c.isOverdue).length

  return (
    <div className="flex-1 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 mb-4">
        <h1 className="text-xl font-bold text-gray-700">
          Hi, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Ready to learn something new today?
        </p>
      </div>

      <div className="px-4 space-y-4">
        {/* Daily Goal Section */}
        <DailyGoal />

        {/* Overdue Alert */}
        {overdueCount > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-700">
                  {overdueCount} overdue {overdueCount === 1 ? 'course' : 'courses'}
                </p>
                <p className="text-sm text-red-600">Complete these to stay compliant</p>
              </div>
            </div>
          </div>
        )}

        {/* Mandatory Learning Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-700">Required Training</h2>
            <span className="text-sm text-gray-400">
              {mandatoryLearning.filter((c) => c.progress === 100).length}/{mandatoryLearning.length} complete
            </span>
          </div>

          <div className="space-y-3">
            {mandatoryLearning.length === 0 ? (
              <div className="card text-center py-8">
                <span className="text-4xl mb-2 block">🎉</span>
                <p className="font-semibold text-gray-600">All caught up!</p>
                <p className="text-sm text-gray-400 mt-1">
                  No mandatory training right now
                </p>
              </div>
            ) : (
              mandatoryLearning.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onContinue={() => handleContinue(course.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Quick action */}
        <div className="card bg-gradient-to-r from-[var(--color-duo-green)] to-[var(--color-duo-green-light)] text-white p-6">
          <h3 className="font-bold text-lg mb-2">Quick Boost</h3>
          <p className="text-sm opacity-90 mb-4">
            Earn 10 XP with a 2-minute micro-lesson
          </p>
          <button className="bg-white text-[var(--color-duo-green)] font-bold px-4 py-2 rounded-xl">
            Start Now →
          </button>
        </div>
      </div>
    </div>
  )
}
