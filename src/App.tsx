import { useEffect, useState } from 'react'
import { useStore } from './store'
import { api } from './api/client'
import { isDev, getOrgLogo } from './config'
import { ModeSwitch } from './components/ModeSwitch'
import { BottomNav } from './components/BottomNav'
import { AskOverlay } from './components/AskOverlay'
import { LearnerHome } from './screens/LearnerHome'
import { ManagerHome } from './screens/ManagerHome'
import { CourseContent } from './screens/CourseContent'
import { ExploreScreen } from './screens/ExploreScreen'
import { ProgressScreen } from './screens/ProgressScreen'
import { MeScreen } from './screens/MeScreen'

function App() {
  const { mode, currentScreen, setUser, isLoading, isAskOverlayOpen } = useStore()
  const [showSplash, setShowSplash] = useState(isDev)

  // Hide splash screen after delay (dev mode only)
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showSplash])

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

  // Splash screen for dev mode
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[var(--surface-primary)] flex flex-col items-center justify-center z-[9999]">
        <div className="animate-scale-in flex flex-col items-center">
          <img
            src={getOrgLogo()}
            alt="Organization logo"
            className="h-16 w-auto object-contain mb-6"
          />
          <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-sm text-[var(--text-tertiary)] font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="app-content">
        {/* Mode Switcher (only for managers, hidden during course content) */}
        {currentScreen !== 'course-content' && <ModeSwitch />}

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
          {currentScreen === 'course-content' ? (
            <CourseContent />
          ) : currentScreen === 'explore' ? (
            <ExploreScreen />
          ) : currentScreen === 'progress' ? (
            <ProgressScreen />
          ) : currentScreen === 'me' ? (
            <MeScreen />
          ) : mode === 'learner' ? (
            <LearnerHome />
          ) : (
            <ManagerHome />
          )}
        </main>

        {/* Bottom Navigation - hide when viewing course content */}
        {currentScreen !== 'course-content' && <BottomNav />}

        {/* Ask Overlay */}
        {isAskOverlayOpen && <AskOverlay />}
      </div>
    </div>
  )
}

export default App
