/**
 * Application constants
 */

// Session storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'soc_auth_token',
  USER_DATA: 'soc_user_data',
  REPORTS: 'soc_reports',
  AUDIT_LOGS: 'soc_audit_logs'
} as const;

// Security configuration
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes
  REQUIRE_STRONG_PASSWORDS: true,
  LOG_ALL_ACTIONS: true
} as const;

// Demo users (in production, this would be in a secure backend)
// WARNING: These are for demonstration only
export const DEMO_USERS = {
  analyst: {
    username: 'analyst',
    password: 'Analyst123', // Demo password - never hardcode in production
    clearanceLevel: 'ANALYST' as const
  },
  commander: {
    username: 'commander',
    password: 'Commander123',
    clearanceLevel: 'FIELD_COMMANDER' as const
  },
  admin: {
    username: 'admin',
    password: 'Admin123',
    clearanceLevel: 'ADMIN' as const
  }
} as const;

// UI Configuration
export const UI_CONFIG = {
  REPORTS_PER_PAGE: 10,
  AUTO_REFRESH_INTERVAL_MS: 30000, // 30 seconds
  NOTIFICATION_DURATION_MS: 3000
} as const;
