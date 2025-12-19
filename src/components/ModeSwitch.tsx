import { useStore } from '../store'

export function ModeSwitch() {
  const { mode, setMode, user } = useStore()

  if (!user.isManager) return null

  return (
    <div className="flex items-center justify-center px-4 py-3 bg-[var(--surface-primary)] border-b border-[var(--border-primary)]">
      <div className="flex bg-[var(--surface-tertiary)] rounded-full p-1 gap-0.5 shadow-sm">
        <button
          onClick={() => setMode('learner')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ease-out ${
            mode === 'learner'
              ? 'bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-md'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
          }`}
          style={{
            boxShadow: mode === 'learner'
              ? '0 2px 8px rgba(88, 204, 2, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
              : 'none'
          }}
        >
          My Learning
        </button>
        <button
          onClick={() => setMode('manager')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ease-out ${
            mode === 'manager'
              ? 'bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-secondary-dark)] text-white shadow-md'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
          }`}
          style={{
            boxShadow: mode === 'manager'
              ? '0 2px 8px rgba(28, 176, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
              : 'none'
          }}
        >
          My Team
        </button>
      </div>
    </div>
  )
}
