import { useStore } from '../store'
import { ProgressRing } from './ProgressRing'

export function DailyGoal() {
  const { dailyGoal, streak } = useStore()

  const progress = Math.min((dailyGoal.currentXP / dailyGoal.targetXP) * 100, 100)
  const remaining = Math.max(dailyGoal.targetXP - dailyGoal.currentXP, 0)

  return (
    <div className="card flex items-center gap-4 p-4">
      <ProgressRing
        progress={progress}
        size={80}
        strokeWidth={8}
        color={dailyGoal.completed ? 'var(--color-gold)' : 'var(--color-primary)'}
      >
        <div className="text-center">
          {dailyGoal.completed ? (
            <span className="text-2xl">⭐</span>
          ) : (
            <>
              <span className="text-xl font-extrabold text-[var(--text-primary)]">
                {dailyGoal.currentXP}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block -mt-0.5">XP</span>
            </>
          )}
        </div>
      </ProgressRing>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-[var(--text-primary)] text-base">
            {dailyGoal.completed ? 'Goal Complete!' : 'Daily Goal'}
          </h3>
          {/* Streak indicator - inline */}
          <div className="flex items-center gap-1.5 bg-[var(--surface-tertiary)] px-2.5 py-1 rounded-full">
            <span className="text-base flame-icon">🔥</span>
            <span className="font-bold text-orange-500 text-sm">{streak.current}</span>
          </div>
        </div>

        {dailyGoal.completed ? (
          <p className="text-sm text-[var(--color-gold)] font-semibold mt-1">
            You're on fire! Keep the streak going tomorrow.
          </p>
        ) : (
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            <span className="font-semibold text-[var(--color-primary)]">{remaining} XP</span> to reach your daily goal
          </p>
        )}
      </div>
    </div>
  )
}
