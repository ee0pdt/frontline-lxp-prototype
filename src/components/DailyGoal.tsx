import { useStore } from '../store'
import { ProgressRing } from './ProgressRing'

export function DailyGoal() {
  const { dailyGoal, streak } = useStore()

  const progress = Math.min((dailyGoal.currentXP / dailyGoal.targetXP) * 100, 100)
  const remaining = Math.max(dailyGoal.targetXP - dailyGoal.currentXP, 0)

  return (
    <div className="card flex items-center gap-6 p-6">
      <ProgressRing
        progress={progress}
        size={100}
        strokeWidth={10}
        color={dailyGoal.completed ? 'var(--color-duo-gold)' : 'var(--color-duo-green)'}
      >
        <div className="text-center">
          {dailyGoal.completed ? (
            <span className="text-3xl">⭐</span>
          ) : (
            <>
              <span className="text-2xl font-extrabold text-gray-700">
                {dailyGoal.currentXP}
              </span>
              <span className="text-xs text-gray-400 block">XP</span>
            </>
          )}
        </div>
      </ProgressRing>

      <div className="flex-1">
        <h3 className="font-bold text-gray-700 text-lg mb-1">
          {dailyGoal.completed ? 'Goal Complete!' : 'Daily Goal'}
        </h3>
        {dailyGoal.completed ? (
          <p className="text-sm text-[var(--color-duo-gold)] font-semibold">
            You're on fire! 🔥 Keep the streak going tomorrow.
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-[var(--color-duo-green)]">{remaining} XP</span> to reach your daily goal
          </p>
        )}

        {/* Streak indicator */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xl flame-icon">🔥</span>
          <span className="font-bold text-orange-500">{streak.current} day streak</span>
        </div>
      </div>
    </div>
  )
}
