import { useStore } from '../store'

export function MeScreen() {
  const { user } = useStore()

  return (
    <div className="flex-1 flex flex-col bg-[var(--surface-secondary)]">
      {/* Header */}
      <div className="bg-[var(--surface-primary)] px-4 py-6 border-b border-[var(--border-primary)] flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white font-bold text-xl">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{user.name}</h1>
            <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {/* Feedback Section */}
        <div className="card">
          <h2 className="font-bold text-[var(--text-primary)] mb-2">Share Feedback</h2>
          <p className="text-sm text-[var(--text-muted)] mb-3">
            Have ideas or suggestions? Let us know!
          </p>
          <button className="btn-primary w-full py-3 text-sm">
            Send Feedback to HQ
          </button>
        </div>

        {/* Career Goals */}
        <div className="card">
          <h2 className="font-bold text-[var(--text-primary)] mb-2">Career Goals</h2>
          <p className="text-sm text-[var(--text-muted)] mb-3">
            Set your development goals and track your progress
          </p>
          <button className="btn-subtle w-full py-3 text-sm">
            Set Goals
          </button>
        </div>

        {/* Settings */}
        <div className="card">
          <h2 className="font-bold text-[var(--text-primary)] mb-3">Settings</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between py-2 text-left">
              <span className="text-sm text-[var(--text-secondary)]">Notifications</span>
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="border-t border-[var(--border-primary)]" />
            <button className="w-full flex items-center justify-between py-2 text-left">
              <span className="text-sm text-[var(--text-secondary)]">Preferences</span>
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="border-t border-[var(--border-primary)]" />
            <button className="w-full flex items-center justify-between py-2 text-left">
              <span className="text-sm text-[var(--text-secondary)]">Help & Support</span>
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-xs text-[var(--text-muted)] pt-4">
          <p>Frontline LXP v1.0.0</p>
        </div>
      </div>
    </div>
  )
}
