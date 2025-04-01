
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "./types/auth.types";

// Auth event types
export type AuthEventType = 
  | 'AUTH_READY'
  | 'AUTH_SIGNED_IN'
  | 'AUTH_SIGNED_OUT'
  | 'AUTH_USER_UPDATED'
  | 'AUTH_SESSION_UPDATED'
  | 'AUTH_ERROR';

// Auth event interface
export interface AuthEvent {
  type: AuthEventType;
  payload?: {
    user?: User | null;
    session?: Session | null;
    roles?: UserRole[];
    error?: string | null;
  };
}

// Auth event listener type
export type AuthEventListener = (event: AuthEvent) => void;

// Event emitter for auth events
class AuthEventEmitter {
  private listeners: AuthEventListener[] = [];

  subscribe(listener: AuthEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(event: AuthEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error("Error in auth event listener:", error);
      }
    });
  }
}

// Create singleton instance
const eventEmitter = new AuthEventEmitter();

// Subscribe to auth events
export const subscribeToAuthEvents = (listener: AuthEventListener): () => void => {
  return eventEmitter.subscribe(listener);
};

// Event notification functions
export const notifyAuthReady = (user: User | null, session: Session | null, roles: UserRole[] = []) => {
  eventEmitter.emit({
    type: 'AUTH_READY',
    payload: { user, session, roles }
  });
};

export const notifySignIn = (user: User | null, session: Session | null, roles: UserRole[] = []) => {
  eventEmitter.emit({
    type: 'AUTH_SIGNED_IN',
    payload: { user, session, roles }
  });
};

export const notifySignOut = () => {
  eventEmitter.emit({
    type: 'AUTH_SIGNED_OUT'
  });
};

export const notifyUserUpdated = (user: User | null) => {
  eventEmitter.emit({
    type: 'AUTH_USER_UPDATED',
    payload: { user }
  });
};

export const notifySessionUpdated = (session: Session | null) => {
  eventEmitter.emit({
    type: 'AUTH_SESSION_UPDATED',
    payload: { session }
  });
};

export const notifyAuthError = (error: string) => {
  eventEmitter.emit({
    type: 'AUTH_ERROR',
    payload: { error }
  });
};
