import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useStore } from './store'
import { api } from './api/client'
import { ModeSwitch } from './components/ModeSwitch'
import { BottomNav } from './components/BottomNav'
import { LearnerHome } from './screens/LearnerHome'
import { ManagerHome } from './screens/ManagerHome'
import { CourseContent } from './screens/CourseContent'
import { useRouterState, Outlet } from '@tanstack/react-router'

// Root layout component
function RootLayout() {
  const { setUser, isLoading } = useStore()
  const routerState = useRouterState()
  const isHomePage = routerState.location.pathname === '/' || routerState.location.pathname === ''

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await api.getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error('Failed to load user:', error)
      }
    }
    loadUser()
  }, [setUser])

  return (
    <div className="min-h-[100dvh] bg-[var(--surface-secondary)] flex flex-col w-full">
      {/* Mode Switcher - only show on home page */}
      {isHomePage && <ModeSwitch />}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-[var(--overlay-bg)] backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[var(--text-tertiary)] font-semibold">Loading...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Bottom Navigation - only show on home page */}
      {isHomePage && <BottomNav />}
    </div>
  )
}

// Home page component
function HomePage() {
  const { mode } = useStore()
  return mode === 'learner' ? <LearnerHome /> : <ManagerHome />
}

// Create routes
const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const courseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/course/$courseId',
  component: CourseContent,
})

// Create route tree
export const routeTree = rootRoute.addChildren([indexRoute, courseRoute])

// Create router
export const router = createRouter({
  routeTree,
  basepath: '/frontline-lxp-prototype/',
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
