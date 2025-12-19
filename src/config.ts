// Configuration from LXP Content Box injection
// In production, these values come from window.FRONTLINE_CONFIG
// In development, we use mock data

interface FrontlineConfig {
  userId: number
  userName: string
  userEmail: string
  token: string
  orgId: number
  orgAlias: string
  apiBase: string
  lxpApiBase: string // Legacy LXP API (without /lxp/ prefix)
}

export interface LXPTheme {
  colorButton?: string
  colorButtonText?: string
  colorFocus?: string
  colorPrimary?: string
  colorPrimaryText?: string
  colorSecondary?: string
  colorSecondaryText?: string
  direction?: 'ltr' | 'rtl'
  fontFamily?: string
  navBarBg?: string
  radiusMedium?: string
  shadowMedium?: string
}

declare global {
  interface Window {
    FRONTLINE_CONFIG?: FrontlineConfig
    USER_ID?: number
    USER_NAME?: string
    USER_EMAIL?: string
    BEARER_TOKEN?: string
    ORG_ID?: number
    ORG_ALIAS?: string
    ORG_LOGO?: string
    theme?: LXPTheme
  }
}

// Get organization logo - uses window.ORG_LOGO in production, M&S logo in dev
export function getOrgLogo(): string {
  if (window.ORG_LOGO) {
    return window.ORG_LOGO
  }
  // Default to M&S logo for dev/demo
  return '/frontline-lxp-prototype/ms-logo.svg'
}

// Development mock configuration
const devConfig: FrontlineConfig = {
  userId: 1,
  userName: 'Demo User',
  userEmail: 'demo@example.com',
  token: 'dev-token',
  orgId: 1,
  orgAlias: 'petedev',
  apiBase: 'http://petedev.curatr3.com/lxp/api/v1',
  lxpApiBase: 'http://petedev.curatr3.com/api/v1', // Legacy API without /lxp/ prefix
}

// Derive LXP API base from page origin (for when running embedded in LXP)
function getLxpApiBase(): string {
  // In dev, use the dev config
  if (!window.FRONTLINE_CONFIG && !window.BEARER_TOKEN) {
    return devConfig.lxpApiBase
  }
  // In production, derive from current page origin
  return `${window.location.origin}/api/v1`
}

// Get config from Content Box injection or use dev defaults
export const config: FrontlineConfig = window.FRONTLINE_CONFIG
  ? {
      ...window.FRONTLINE_CONFIG,
      lxpApiBase: window.FRONTLINE_CONFIG.lxpApiBase || getLxpApiBase(),
    }
  : {
      userId: window.USER_ID || devConfig.userId,
      userName: window.USER_NAME || devConfig.userName,
      userEmail: window.USER_EMAIL || devConfig.userEmail,
      token: window.BEARER_TOKEN || devConfig.token,
      orgId: window.ORG_ID || devConfig.orgId,
      orgAlias: window.ORG_ALIAS || devConfig.orgAlias,
      apiBase: devConfig.apiBase,
      lxpApiBase: getLxpApiBase(),
    }

export const isDev = !window.FRONTLINE_CONFIG && !window.BEARER_TOKEN
