import { useStore } from '../store'

export function ModeSwitch() {
  const { mode, setMode, user } = useStore()

  if (!user.isManager) return null

  return (
    <div className="flex items-center justify-center p-2 bg-white border-b border-gray-100">
      <div className="flex bg-gray-100 rounded-full p-1">
        <button
          onClick={() => setMode('learner')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            mode === 'learner'
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Learning
        </button>
        <button
          onClick={() => setMode('manager')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            mode === 'manager'
              ? 'bg-[var(--color-secondary)] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Team
        </button>
      </div>
    </div>
  )
}
