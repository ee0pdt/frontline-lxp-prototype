import { useStore } from '../store'

export function ModeSwitch() {
  const { mode, setMode, user } = useStore()

  if (!user.isManager) return null

  return (
    <div className="flex items-center justify-center px-4 py-2 bg-[var(--surface-primary)] border-b border-[var(--border-primary)]">
      <div className="flex bg-[var(--surface-tertiary)] rounded-full p-1 gap-1">
        <button
          onClick={() => setMode('learner')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
            mode === 'learner'
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
        >
          My Learning
        </button>
        <button
          onClick={() => setMode('manager')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
            mode === 'manager'
              ? 'bg-[var(--color-secondary)] text-white shadow-sm'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
        >
          My Team
        </button>
      </div>
    </div>
  )
}
