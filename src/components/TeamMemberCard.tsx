import type { TeamMember } from '../store'

interface TeamMemberCardProps {
  member: TeamMember
  onRemind?: () => void
}

export function TeamMemberCard({ member, onRemind }: TeamMemberCardProps) {
  const getComplianceColor = (percent: number) => {
    if (percent >= 80) return 'var(--color-duo-green)'
    if (percent >= 50) return 'var(--color-duo-orange)'
    return 'var(--color-duo-red)'
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
    <div className={`card flex items-center gap-3 ${member.needsAttention ? 'ring-2 ring-amber-300 bg-amber-50' : ''}`}>
      {/* Avatar */}
      <div className="relative">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--color-duo-blue)] flex items-center justify-center">
            <span className="text-white font-bold">{getInitials(member.name)}</span>
          </div>
        )}
        {member.needsAttention && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-xs">
            ⚠️
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-700 truncate">{member.name}</h4>
        <div className="flex items-center gap-3 mt-1">
          {/* Streak */}
          <span className="flex items-center gap-1 text-sm">
            <span className="text-orange-400">🔥</span>
            <span className="font-semibold text-gray-500">{member.streak}</span>
          </span>
          {/* Compliance */}
          <span className="flex items-center gap-1 text-sm">
            <span>✓</span>
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
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="var(--color-duo-gray-100)"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
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
          className="px-3 py-1.5 bg-[var(--color-duo-orange)] text-white text-xs font-semibold rounded-lg"
        >
          Nudge
        </button>
      )}
    </div>
  )
}
