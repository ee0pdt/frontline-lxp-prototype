import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initializeTheme } from './theme'

// Initialize theme from window.theme (LXP Content Box)
initializeTheme()

// Mount to #frontline-app (Content Box) or #root (dev mode)
const container = document.getElementById('frontline-app') || document.getElementById('root')

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
