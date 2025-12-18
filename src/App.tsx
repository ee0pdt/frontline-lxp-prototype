import { useEffect } from 'react'
import { useStore } from './store'
import { api } from './api/client'
import { ModeSwitch } from './components/ModeSwitch'
import { BottomNav } from './components/BottomNav'
import { LearnerHome } from './screens/LearnerHome'
import { ManagerHome } from './screens/ManagerHome'

function App() {
  const { mode, setUser, isLoading } = useStore()

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
    <div className="min-h-screen bg-[var(--color-duo-gray-50)] flex flex-col max-w-lg mx-auto">
      {/* Mode Switcher (only for managers) */}
      <ModeSwitch />

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[var(--color-duo-green)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-semibold">Loading...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {mode === 'learner' ? <LearnerHome /> : <ManagerHome />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

export default App
