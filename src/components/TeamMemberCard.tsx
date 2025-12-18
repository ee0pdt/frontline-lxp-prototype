import type { TeamMember } from '../store'

interface TeamMemberCardProps {
  member: TeamMember
  onRemind?: () => void
}

export function TeamMemberCard({ member, onRemind }: TeamMemberCardProps) {
  const getComplianceColor = (percent: number) => {
    if (percent >= 80) return 'var(--color-primary)'
    if (percent >= 50) return 'var(--color-warning)'
    return 'var(--color-danger)'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={`card flex items-center gap-3 ${member.needsAttention ? 'ring-2 ring-amber-400/50 bg-[var(--alert-warning-bg)]' : ''}`}>
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="w-11 h-11 rounded-full object-cover"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[var(--color-secondary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">{getInitials(member.name)}</span>
          </div>
        )}
        {member.needsAttention && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[10px]">
            !
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[var(--text-primary)] text-sm truncate">{member.name}</h4>
        <div className="flex items-center gap-3 mt-0.5">
          {/* Streak */}
          <span className="flex items-center gap-1 text-xs">
            <span className="text-orange-400">🔥</span>
            <span className="font-semibold text-[var(--text-secondary)]">{member.streak}</span>
          </span>
          {/* Compliance */}
          <span className="flex items-center gap-1 text-xs">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: getComplianceColor(member.compliancePercent) }}>
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span
              className="font-semibold"
              style={{ color: getComplianceColor(member.compliancePercent) }}
            >
              {member.compliancePercent}%
            </span>
          </span>
        </div>
      </div>

      {/* Mini progress ring */}
      <div className="relative w-9 h-9 flex-shrink-0">
        <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="var(--progress-bg)"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke={getComplianceColor(member.compliancePercent)}
            strokeWidth="3"
            strokeDasharray={`${member.compliancePercent} 100`}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Remind button for members needing attention */}
      {member.needsAttention && onRemind && (
        <button
          onClick={onRemind}
          className="px-3 py-1.5 bg-[var(--color-warning)] text-white text-xs font-bold rounded-lg flex-shrink-0 active:scale-95 transition-transform"
        >
          Nudge
        </button>
      )}
    </div>
  )
}
