import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import './index.css'
import { router } from './routeTree.gen'
import { initializeTheme } from './theme'

// Initialize theme from window.theme (LXP Content Box)
initializeTheme()

// Mount to #frontline-app (Content Box) or #root (dev mode)
const container = document.getElementById('frontline-app') || document.getElementById('root')

if (container) {
  createRoot(container).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
