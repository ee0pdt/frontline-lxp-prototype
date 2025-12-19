import { useEffect } from 'react'
import { useStore } from '../store'
import { api } from '../api/client'
import { getOrgLogo } from '../config'
import { ProgressRing } from '../components/ProgressRing'
import { TeamMemberCard } from '../components/TeamMemberCard'

export function ManagerHome() {
  const { team, setTeam, teamStats, setTeamStats, setIsLoading } = useStore()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [teamData, statsData] = await Promise.all([
          api.getTeam(),
          api.getTeamStats(),
        ])
        setTeam(teamData)
        setTeamStats(statsData)
      } catch (error) {
        console.error('Failed to load team data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [setTeam, setTeamStats, setIsLoading])

  const needsAttentionCount = team.filter((m) => m.needsAttention).length
  const needsAttention = team.filter((m) => m.needsAttention)
  const onTrack = team.filter((m) => !m.needsAttention)

  const getComplianceColor = (percent: number) => {
    if (percent >= 80) return 'var(--color-primary)'
    if (percent >= 50) return 'var(--color-warning)'
    return 'var(--color-danger)'
  }

  const handleRemind = (memberId: number) => {
    console.log('Sending reminder to:', memberId)
    alert('Reminder sent! (Demo)')
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--surface-secondary)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)] text-white px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Organization Logo */}
            <div className="h-8 w-auto bg-white rounded px-2 py-1 flex items-center justify-center">
              <img
                src={getOrgLogo()}
                alt="Organization logo"
                className="h-5 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold">Team Overview</h1>
              <p className="text-sm opacity-80">
                {teamStats.totalMembers} team members
              </p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-[var(--surface-secondary)]">
        <div className="px-4 py-4 pb-24 space-y-4 stagger-fade-in">
          {/* Team Stats Summary */}
          <div className="card flex items-center gap-4 p-4">
            <ProgressRing
              progress={teamStats.compliancePercent}
              size={72}
              strokeWidth={7}
              color={getComplianceColor(teamStats.compliancePercent)}
            >
              <div className="text-center">
                <span
                  className="text-lg font-extrabold"
                  style={{ color: getComplianceColor(teamStats.compliancePercent) }}
                >
                  {teamStats.compliancePercent}%
                </span>
              </div>
            </ProgressRing>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[var(--text-primary)] text-base mb-2">
                Team Compliance
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="text-[var(--text-muted)] text-xs">Avg Streak</span>
                  <p className="font-bold text-orange-500 flex items-center gap-1 text-sm">
                    <span className="text-sm">🔥</span> {teamStats.averageStreak.toFixed(1)}d
                  </p>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] text-xs">This Week</span>
                  <p className="font-bold text-[var(--color-primary)] text-sm">
                    {teamStats.completedThisWeek} done
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Needs Attention Section */}
          {needsAttentionCount > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-amber-600">
                  Needs Attention ({needsAttentionCount})
                </h2>
              </div>
              <div className="space-y-2">
                {needsAttention.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    onRemind={() => handleRemind(member.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* On Track Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                On Track ({onTrack.length})
              </h2>
            </div>
            <div className="space-y-2">
              {onTrack.length === 0 ? (
                <div className="card text-center py-6">
                  <p className="text-[var(--text-muted)] text-sm">Everyone needs a little help right now</p>
                </div>
              ) : (
                onTrack.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="card card-interactive bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)] text-white p-4 text-center border-0 shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg className="w-6 h-6 mx-auto mb-2 relative group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-bold text-sm relative">Full Report</span>
            </button>
            <button className="card card-interactive bg-gradient-to-br from-[var(--color-accent)] to-[#B366E0] text-white p-4 text-center border-0 shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg className="w-6 h-6 mx-auto mb-2 relative group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span className="font-bold text-sm relative">Announce</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
