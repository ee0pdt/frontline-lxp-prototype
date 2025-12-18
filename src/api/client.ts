import { config, isDev } from '../config'
import type { Course, Badge, TeamMember, TeamStats, User, CourseObject } from '../store'

class ApiClient {
  private baseUrl: string
  private lxpApiBase: string
  private token: string

  constructor() {
    this.baseUrl = config.apiBase
    this.lxpApiBase = config.lxpApiBase
    this.token = config.token
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetchFromBase<T>(this.baseUrl, endpoint, options)
  }

  private async fetchLxp<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetchFromBase<T>(this.lxpApiBase, endpoint, options)
  }

  private async fetchFromBase<T>(baseUrl: string, endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${baseUrl}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    // Only include Authorization header if we have a real token
    // When running inside the LXP, cookie-based auth is used instead
    if (this.token && this.token !== 'dev-token') {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    if (isDev) return mockData.user

    const data = await this.fetch<{ data: unknown }>('/users/current')
    return transformUser(data.data)
  }

  // Learning activities
  async getMandatoryLearning(): Promise<Course[]> {
    if (isDev) return mockData.mandatoryLearning

    const data = await this.fetch<{ items: unknown[] }>(
      `/user-learning-activities/${config.userId}/mandatory?limit=10`
    )
    return (data.items || []).map(transformCourse)
  }

  async getRecentLearning(): Promise<Course[]> {
    if (isDev) return mockData.recentLearning

    const data = await this.fetch<{ items: unknown[] }>(
      `/user-learning-activities/${config.userId}/recent?limit=5`
    )
    return (data.items || []).map(transformCourse)
  }

  async getRecommendations(): Promise<Course[]> {
    if (isDev) return mockData.recommendations

    const data = await this.fetch<{ items: unknown[] }>(
      `/user-learning-activities/${config.userId}/recommendations?limit=10`
    )
    return (data.items || []).map(transformCourse)
  }

  // Badges
  async getBadges(): Promise<Badge[]> {
    if (isDev) return mockData.badges

    const data = await this.fetch<{ data: unknown[] }>(`/users/${config.userId}/badges`)
    return data.data.map(transformBadge)
  }

  // Team (Manager)
  async getTeam(): Promise<TeamMember[]> {
    if (isDev) return mockData.teamMembers

    try {
      const data = await this.fetch<{ data: unknown[] }>(`/users/${config.userId}/team`)
      return data.data.map(transformTeamMember)
    } catch {
      return []
    }
  }

  async getTeamStats(): Promise<TeamStats> {
    if (isDev) return mockData.teamStats

    try {
      const data = await this.fetch<{ data: unknown }>(`/users/${config.userId}/team-stats`)
      return transformTeamStats(data.data)
    } catch {
      return { totalMembers: 0, compliancePercent: 0, averageStreak: 0, completedThisWeek: 0 }
    }
  }

  // Launch a course
  async launchCourse(courseId: number): Promise<{ url: string }> {
    const data = await this.fetch<{ data: { url: string } }>(
      `/learning-activities/${courseId}/launch`
    )
    return data.data
  }

  // Get course objects (content items) - uses legacy LXP API
  async getCourseObjects(courseId: number, levelId?: number): Promise<CourseObject[]> {
    if (isDev) return mockData.courseObjects

    let endpoint = `/courses/${courseId}/objects?ordering=created&group_id=0&filter=all&per_page=20`
    if (levelId) {
      endpoint += `&level=${levelId}`
    }

    const data = await this.fetchLxp<{ results: unknown[] }>(endpoint)
    return (data.results || []).map(transformCourseObject)
  }
}

// Transform functions (map API response to our types)
function transformUser(data: unknown): User {
  const d = data as Record<string, unknown>
  return {
    id: d.id as number,
    name: (d.full_name || d.name || 'User') as string,
    email: (d.email || '') as string,
    avatar: d.profile_pic_url as string | undefined,
    isManager: Boolean(d.is_manager || d.team_count),
  }
}

function transformCourse(data: unknown): Course {
  const d = data as Record<string, unknown>
  // API returns nested learning_activity object with course details
  const la = (d.learning_activity || d) as Record<string, unknown>
  const enrolment = d.enrolment as Record<string, unknown> | undefined

  const dueDate = (d.due_date || enrolment?.due_date) as string | undefined
  const isOverdue = dueDate ? new Date(dueDate) < new Date() : false

  // Calculate progress from enrolment if available
  const progress = (d.progress || d.completion_percentage || 0) as number

  return {
    id: (la.id || d.id) as number,
    title: (la.name || la.title || d.title || 'Untitled') as string,
    description: (la.description || d.description || '') as string,
    image: (la.image_url || d.image_url) as string | undefined,
    progress,
    dueDate,
    isOverdue,
    estimatedMinutes: (la.duration_minutes || d.estimated_duration) as number | undefined,
    type: 'mandatory',
  }
}

function transformBadge(data: unknown): Badge {
  const d = data as Record<string, unknown>
  return {
    id: d.id as number,
    name: (d.name || 'Badge') as string,
    description: (d.description || '') as string,
    icon: (d.icon_url || d.image_url || '') as string,
    earnedAt: d.earned_at as string | undefined,
    progress: d.progress as number | undefined,
  }
}

function transformTeamMember(data: unknown): TeamMember {
  const d = data as Record<string, unknown>
  const compliancePercent = (d.compliance_percentage || d.completion_percentage || 0) as number
  return {
    id: d.id as number,
    name: (d.full_name || d.name || 'Team Member') as string,
    avatar: d.profile_pic_url as string | undefined,
    streak: (d.streak || 0) as number,
    compliancePercent,
    needsAttention: compliancePercent < 50,
  }
}

function transformTeamStats(data: unknown): TeamStats {
  const d = data as Record<string, unknown>
  return {
    totalMembers: (d.total_members || d.team_count || 0) as number,
    compliancePercent: (d.compliance_percentage || d.avg_completion || 0) as number,
    averageStreak: (d.average_streak || 0) as number,
    completedThisWeek: (d.completed_this_week || 0) as number,
  }
}

function transformCourseObject(data: unknown): CourseObject {
  const d = data as Record<string, unknown>
  const resource = d.resource as Record<string, unknown> | undefined

  return {
    id: d.id as number,
    name: (d.name || 'Untitled') as string,
    description: (d.description || '') as string,
    imageUrl: (d.image_url || d.square_image_url) as string | undefined,
    completed: Boolean(d.completed),
    type: (resource?.human_type || 'Content') as string,
    resource: {
      id: (resource?.id || 0) as number,
      type: String(resource?.type || 0),
      humanType: (resource?.human_type || 'Content') as string,
      content: (resource?.content || '') as string,
    },
    xp: (d.view_xp || d.target_xp || 1) as number,
    viewTime: (d.view_time || 1) as number,
  }
}

// Mock data for development
const mockData = {
  user: {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: undefined,
    isManager: true,
  },
  mandatoryLearning: [
    {
      id: 1,
      title: 'Food Safety Fundamentals',
      description: 'Essential food handling and safety procedures',
      progress: 65,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      isOverdue: false,
      estimatedMinutes: 15,
      type: 'mandatory' as const,
    },
    {
      id: 2,
      title: 'Customer Service Excellence',
      description: 'Building great customer relationships',
      progress: 30,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isOverdue: false,
      estimatedMinutes: 20,
      type: 'mandatory' as const,
    },
    {
      id: 3,
      title: 'Health & Safety Compliance',
      description: 'Workplace safety regulations and practices',
      progress: 0,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      isOverdue: true,
      estimatedMinutes: 25,
      type: 'mandatory' as const,
    },
  ],
  recentLearning: [
    {
      id: 4,
      title: 'Cash Register Basics',
      description: 'Operating the POS system',
      progress: 100,
      estimatedMinutes: 10,
      type: 'recent' as const,
    },
  ],
  recommendations: [
    {
      id: 5,
      title: 'Upselling Techniques',
      description: 'Increase sales through smart suggestions',
      progress: 0,
      estimatedMinutes: 12,
      type: 'recommended' as const,
    },
    {
      id: 6,
      title: 'Team Communication',
      description: 'Working effectively with your team',
      progress: 0,
      estimatedMinutes: 8,
      type: 'recommended' as const,
    },
  ],
  badges: [
    {
      id: 1,
      name: 'Quick Starter',
      description: 'Completed your first course',
      icon: '🚀',
      earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      name: 'Safety First',
      description: 'Completed all safety training',
      icon: '🛡️',
      progress: 65,
    },
    {
      id: 3,
      name: 'Week Warrior',
      description: 'Learn every day for a week',
      icon: '🔥',
      progress: 43,
    },
  ],
  teamMembers: [
    { id: 2, name: 'Sarah Chen', streak: 12, compliancePercent: 95, needsAttention: false },
    { id: 3, name: 'Mike Rodriguez', streak: 5, compliancePercent: 78, needsAttention: false },
    { id: 4, name: 'Emma Wilson', streak: 0, compliancePercent: 35, needsAttention: true },
    { id: 5, name: 'James Taylor', streak: 8, compliancePercent: 88, needsAttention: false },
    { id: 6, name: 'Lisa Park', streak: 1, compliancePercent: 45, needsAttention: true },
  ],
  teamStats: {
    totalMembers: 5,
    compliancePercent: 68,
    averageStreak: 5.2,
    completedThisWeek: 12,
  },
  courseObjects: [
    {
      id: 1,
      name: 'Introduction to Food Safety',
      description: 'Learn the basics of food safety and why it matters in your daily work.',
      imageUrl: undefined,
      completed: true,
      type: 'YouTube',
      resource: {
        id: 101,
        type: '10',
        humanType: 'YouTube',
        content: '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0" frameborder="0" allowfullscreen></iframe>',
      },
      xp: 5,
      viewTime: 5,
    },
    {
      id: 2,
      name: 'Proper Hand Washing Techniques',
      description: 'Step-by-step guide to effective hand washing procedures.',
      imageUrl: undefined,
      completed: false,
      type: 'URL',
      resource: {
        id: 102,
        type: '1',
        humanType: 'URL',
        content: 'https://www.cdc.gov/handwashing/',
      },
      xp: 3,
      viewTime: 3,
    },
    {
      id: 3,
      name: 'Temperature Control Quiz',
      description: 'Test your knowledge of safe food temperatures.',
      imageUrl: undefined,
      completed: false,
      type: 'Content',
      resource: {
        id: 103,
        type: '5',
        humanType: 'Quiz',
        content: '',
      },
      xp: 10,
      viewTime: 10,
    },
  ],
}

export const api = new ApiClient()
