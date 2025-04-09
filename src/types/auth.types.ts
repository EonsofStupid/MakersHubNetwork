
// Define user roles that are recognized by the system
export type UserRole = 
  | 'user' 
  | 'admin' 
  | 'super_admin' 
  | 'editor' 
  | 'viewer' 
  | 'maker' 
  | 'builder' 
  | 'moderator'
  | 'service'
  | 'guest';

// Define auth event types for consistent messaging
export type AuthEventType = 
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY'
  | 'TOKEN_REFRESHED'
  | 'INITIALIZED'
  | 'SESSION_UPDATED'
  | 'AUTH_SIGNED_IN' // Legacy event type
  | 'AUTH_SIGNED_OUT'; // Legacy event type

// Define the structure of auth events
export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

// Define the structure of auth event listener
export type AuthEventListener = (event: AuthEvent) => void;
