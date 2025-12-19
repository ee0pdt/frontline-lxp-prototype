export function ExploreScreen() {

  return (
    <div className="flex-1 flex flex-col bg-[var(--surface-secondary)]">
      {/* Header */}
      <div className="bg-[var(--surface-primary)] px-4 py-3 border-b border-[var(--border-primary)] flex-shrink-0">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Explore</h1>
        <p className="text-xs text-[var(--text-muted)]">Discover new learning opportunities</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="card text-center py-12">
          <span className="text-4xl mb-3 block">🔍</span>
          <p className="font-bold text-[var(--text-primary)]">Coming Soon</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Browse courses, categories, and recommendations
          </p>
        </div>
      </div>
    </div>
  )
}
