
/**
 * Authentication event types shared across the application
 */
export enum AuthEventType {
  // Auth state changes
  AUTH_STATE_CHANGE = 'AUTH_STATE_CHANGE',
  
  // User events
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_UP = 'SIGNED_UP',
  SIGNED_OUT = 'SIGNED_OUT',
  USER_UPDATED = 'USER_UPDATED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  PASSWORD_UPDATED = 'PASSWORD_UPDATED',
  
  // Session events
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  SESSION_DELETED = 'SESSION_DELETED',
  
  // Profile events
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  
  // Account management
  ACCOUNT_LINKED = 'ACCOUNT_LINKED',
  ACCOUNT_UNLINKED = 'ACCOUNT_UNLINKED',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED'
}

/**
 * Authentication event structure
 */
export interface AuthEvent {
  type: AuthEventType;
  payload?: {
    user?: any;
    session?: any;
    profile?: any;
    error?: any;
  };
  timestamp: number;
}
