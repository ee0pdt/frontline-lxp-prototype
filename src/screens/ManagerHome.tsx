import { useEffect } from 'react'
import { useStore } from '../store'
import { api } from '../api/client'
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
    if (percent >= 80) return 'var(--color-duo-green)'
    if (percent >= 50) return 'var(--color-duo-orange)'
    return 'var(--color-duo-red)'
  }

  const handleRemind = (memberId: number) => {
    // In a real app, this would send a reminder
    console.log('Sending reminder to:', memberId)
    alert('Reminder sent! (Demo)')
  }

  return (
    <div className="flex-1 pb-20">
      {/* Header */}
      <div className="bg-[var(--color-duo-blue)] text-white px-4 py-6 mb-4">
        <h1 className="text-xl font-bold">Team Overview</h1>
        <p className="text-sm opacity-80 mt-1">
          {teamStats.totalMembers} team members
        </p>
      </div>

      <div className="px-4 space-y-4">
        {/* Team Stats Summary */}
        <div className="card flex items-center gap-6 p-6">
          <ProgressRing
            progress={teamStats.compliancePercent}
            size={100}
            strokeWidth={10}
            color={getComplianceColor(teamStats.compliancePercent)}
          >
            <div className="text-center">
              <span
                className="text-2xl font-extrabold"
                style={{ color: getComplianceColor(teamStats.compliancePercent) }}
              >
                {teamStats.compliancePercent}%
              </span>
            </div>
          </ProgressRing>

          <div className="flex-1">
            <h3 className="font-bold text-gray-700 text-lg mb-2">
              Team Compliance
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">Avg Streak</span>
                <p className="font-semibold text-orange-500 flex items-center gap-1">
                  <span>🔥</span> {teamStats.averageStreak.toFixed(1)} days
                </p>
              </div>
              <div>
                <span className="text-gray-400">This Week</span>
                <p className="font-semibold text-[var(--color-duo-green)]">
                  {teamStats.completedThisWeek} completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Needs Attention Section */}
        {needsAttentionCount > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⚠️</span>
              <h2 className="text-lg font-bold text-amber-600">
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
            <span className="text-xl">✅</span>
            <h2 className="text-lg font-bold text-gray-700">
              On Track ({onTrack.length})
            </h2>
          </div>
          <div className="space-y-2">
            {onTrack.length === 0 ? (
              <div className="card text-center py-6">
                <p className="text-gray-500">Everyone needs a little help right now</p>
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
          <button className="card bg-[var(--color-duo-blue)] text-white p-4 text-center">
            <span className="text-2xl block mb-2">📊</span>
            <span className="font-semibold text-sm">Full Report</span>
          </button>
          <button className="card bg-[var(--color-duo-purple)] text-white p-4 text-center">
            <span className="text-2xl block mb-2">📢</span>
            <span className="font-semibold text-sm">Team Announcement</span>
          </button>
        </div>
      </div>
    </div>
  )
}
