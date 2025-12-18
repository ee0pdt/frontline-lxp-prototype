import { useState } from 'react'

type NavItem = 'home' | 'learn' | 'achievements' | 'profile'

interface BottomNavProps {
  activeItem?: NavItem
  onNavigate?: (item: NavItem) => void
}

export function BottomNav({ activeItem = 'home', onNavigate }: BottomNavProps) {
  const [active, setActive] = useState<NavItem>(activeItem)

  const handleClick = (item: NavItem) => {
    setActive(item)
    onNavigate?.(item)
  }

  const navItems: { id: NavItem; label: string; icon: string; activeIcon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠', activeIcon: '🏠' },
    { id: 'learn', label: 'Learn', icon: '📚', activeIcon: '📚' },
    { id: 'achievements', label: 'Awards', icon: '🏆', activeIcon: '🏆' },
    { id: 'profile', label: 'Profile', icon: '👤', activeIcon: '👤' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              active === item.id
                ? 'text-[var(--color-primary)]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-xl mb-1">
              {active === item.id ? item.activeIcon : item.icon}
            </span>
            <span className={`text-xs font-semibold ${
              active === item.id ? 'text-[var(--color-primary)]' : ''
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
