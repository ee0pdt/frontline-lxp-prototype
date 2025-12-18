import type { LXPTheme } from './config'

// Helper to darken a hex color by a percentage
function darkenColor(hex: string, percent: number): string {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  const darken = (value: number) => Math.max(0, Math.floor(value * (1 - percent / 100)))
  const toHex = (value: number) => value.toString(16).padStart(2, '0')

  return `#${toHex(darken(r))}${toHex(darken(g))}${toHex(darken(b))}`
}

// Helper to lighten a hex color by a percentage
function lightenColor(hex: string, percent: number): string {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  const lighten = (value: number) => Math.min(255, Math.floor(value + (255 - value) * (percent / 100)))
  const toHex = (value: number) => value.toString(16).padStart(2, '0')

  return `#${toHex(lighten(r))}${toHex(lighten(g))}${toHex(lighten(b))}`
}

// Initialize theme from window.theme
export function initializeTheme(): void {
  const theme: LXPTheme = window.theme || {}
  const root = document.documentElement

  // Map LXP theme colors to CSS custom properties
  if (theme.colorPrimary) {
    root.style.setProperty('--color-primary', theme.colorPrimary)
    root.style.setProperty('--color-primary-dark', darkenColor(theme.colorPrimary, 15))
    root.style.setProperty('--color-primary-light', lightenColor(theme.colorPrimary, 25))
  }

  if (theme.colorSecondary) {
    root.style.setProperty('--color-secondary', theme.colorSecondary)
    root.style.setProperty('--color-secondary-dark', darkenColor(theme.colorSecondary, 15))
    root.style.setProperty('--color-secondary-light', lightenColor(theme.colorSecondary, 25))
  }

  if (theme.colorButton) {
    root.style.setProperty('--color-button', theme.colorButton)
    root.style.setProperty('--color-button-dark', darkenColor(theme.colorButton, 20))
  }

  if (theme.colorButtonText) {
    root.style.setProperty('--color-button-text', theme.colorButtonText)
  }

  if (theme.colorFocus) {
    root.style.setProperty('--color-focus', theme.colorFocus)
  }

  if (theme.colorPrimaryText) {
    root.style.setProperty('--color-primary-text', theme.colorPrimaryText)
  }

  if (theme.colorSecondaryText) {
    root.style.setProperty('--color-secondary-text', theme.colorSecondaryText)
  }

  if (theme.navBarBg) {
    root.style.setProperty('--color-nav-bg', theme.navBarBg)
  }

  if (theme.fontFamily) {
    root.style.setProperty('--font-family-display', theme.fontFamily)
  }

  if (theme.radiusMedium) {
    root.style.setProperty('--radius-button', theme.radiusMedium)
    root.style.setProperty('--radius-card', theme.radiusMedium === '0px' ? '8px' : theme.radiusMedium)
  }

  if (theme.shadowMedium) {
    root.style.setProperty('--shadow-card', theme.shadowMedium)
  }

  if (theme.direction) {
    root.dir = theme.direction
  }
}
