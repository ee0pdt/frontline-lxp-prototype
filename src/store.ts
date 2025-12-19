import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { config } from './config'

export type AppMode = 'learner' | 'manager'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  isManager: boolean
}

export interface Streak {
  current: number
  lastActivityDate: string | null
  freezesRemaining: number
  longestStreak: number
}

export interface DailyGoal {
  targetXP: number
  currentXP: number
  completed: boolean
}

export interface Course {
  id: number
  title: string
  description: string
  image?: string
  progress: number
  dueDate?: string
  isOverdue?: boolean
  estimatedMinutes?: number
  type: 'mandatory' | 'recommended' | 'recent'
  levelId?: number
}

export interface CourseObject {
  id: number
  name: string
  description: string
  imageUrl?: string
  completed: boolean
  type: string
  resource: {
    id: number
    type: string
    humanType: string
    content: string
  }
  xp: number
  viewTime: number
}

export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  earnedAt?: string
  progress?: number
}

export interface TeamMember {
  id: number
  name: string
  avatar?: string
  streak: number
  compliancePercent: number
  needsAttention: boolean
}

export interface TeamStats {
  totalMembers: number
  compliancePercent: number
  averageStreak: number
  completedThisWeek: number
}

interface AppState {
  // Active Course (for course content view)
  activeCourse: Course | null
  setActiveCourse: (course: Course | null) => void
  courseObjects: CourseObject[]
  setCourseObjects: (objects: CourseObject[]) => void

  // Mode
  mode: AppMode
  setMode: (mode: AppMode) => void

  // User
  user: User
  setUser: (user: User) => void

  // Streak & Goals (persisted)
  streak: Streak
  setStreak: (streak: Partial<Streak>) => void
  dailyGoal: DailyGoal
  setDailyGoal: (goal: Partial<DailyGoal>) => void
  addXP: (xp: number) => void

  // Learning
  mandatoryLearning: Course[]
  setMandatoryLearning: (courses: Course[]) => void
  recommendations: Course[]
  setRecommendations: (courses: Course[]) => void
  recentActivity: Course[]
  setRecentActivity: (courses: Course[]) => void

  // Achievements
  badges: Badge[]
  setBadges: (badges: Badge[]) => void

  // Manager
  team: TeamMember[]
  setTeam: (members: TeamMember[]) => void
  teamStats: TeamStats
  setTeamStats: (stats: TeamStats) => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Active Course
      activeCourse: null,
      setActiveCourse: (course) => set({ activeCourse: course }),
      courseObjects: [],
      setCourseObjects: (objects) => set({ courseObjects: objects }),

      // Mode
      mode: 'learner',
      setMode: (mode) => set({ mode }),

      // User - initialized from config
      user: {
        id: config.userId,
        name: config.userName,
        email: config.userEmail,
        isManager: false,
      },
      setUser: (user) => set({ user }),

      // Streak & Goals
      streak: {
        current: 0,
        lastActivityDate: null,
        freezesRemaining: 2,
        longestStreak: 0,
      },
      setStreak: (streak) =>
        set((state) => ({ streak: { ...state.streak, ...streak } })),

      dailyGoal: {
        targetXP: 50,
        currentXP: 0,
        completed: false,
      },
      setDailyGoal: (goal) =>
        set((state) => ({
          dailyGoal: { ...state.dailyGoal, ...goal },
        })),
      addXP: (xp) =>
        set((state) => {
          const newXP = state.dailyGoal.currentXP + xp
          const completed = newXP >= state.dailyGoal.targetXP
          return {
            dailyGoal: {
              ...state.dailyGoal,
              currentXP: newXP,
              completed,
            },
          }
        }),

      // Learning
      mandatoryLearning: [],
      setMandatoryLearning: (courses) => set({ mandatoryLearning: courses }),
      recommendations: [],
      setRecommendations: (courses) => set({ recommendations: courses }),
      recentActivity: [],
      setRecentActivity: (courses) => set({ recentActivity: courses }),

      // Achievements
      badges: [],
      setBadges: (badges) => set({ badges }),

      // Manager
      team: [],
      setTeam: (members) => set({ team: members }),
      teamStats: {
        totalMembers: 0,
        compliancePercent: 0,
        averageStreak: 0,
        completedThisWeek: 0,
      },
      setTeamStats: (stats) => set({ teamStats: stats }),

      // Loading
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'frontline-lxp-storage',
      partialize: (state) => ({
        streak: state.streak,
        dailyGoal: state.dailyGoal,
        mode: state.mode,
      }),
    }
  )
)
