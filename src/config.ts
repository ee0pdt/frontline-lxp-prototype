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
  }
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
}

// Get config from Content Box injection or use dev defaults
export const config: FrontlineConfig = window.FRONTLINE_CONFIG || {
  userId: window.USER_ID || devConfig.userId,
  userName: window.USER_NAME || devConfig.userName,
  userEmail: window.USER_EMAIL || devConfig.userEmail,
  token: window.BEARER_TOKEN || devConfig.token,
  orgId: window.ORG_ID || devConfig.orgId,
  orgAlias: window.ORG_ALIAS || devConfig.orgAlias,
  apiBase: devConfig.apiBase,
}

export const isDev = !window.FRONTLINE_CONFIG && !window.BEARER_TOKEN
