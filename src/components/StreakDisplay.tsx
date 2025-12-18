import { useStore } from '../store'

interface StreakDisplayProps {
  compact?: boolean
}

export function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const { streak } = useStore()

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 bg-[var(--surface-tertiary)] px-3 py-1.5 rounded-full">
        <span className="text-base flame-icon">🔥</span>
        <span className="font-bold text-orange-500 text-sm">{streak.current}</span>
      </div>
    )
  }

  return (
    <div className="card flex items-center gap-4 p-4">
      <div className="relative">
        <span className="text-4xl flame-icon">🔥</span>
        {streak.freezesRemaining > 0 && (
          <span className="absolute -top-1 -right-1 bg-[var(--color-secondary)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {streak.freezesRemaining}
          </span>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-orange-500">
            {streak.current}
          </span>
          <span className="text-[var(--text-secondary)] font-semibold">day streak</span>
        </div>
        {streak.longestStreak > 0 && streak.longestStreak > streak.current && (
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Best: {streak.longestStreak} days
          </p>
        )}
      </div>
      {streak.freezesRemaining > 0 && (
        <div className="text-center">
          <span className="text-2xl">🛡️</span>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {streak.freezesRemaining} freeze{streak.freezesRemaining !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
