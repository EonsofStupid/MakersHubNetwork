
import { BehaviorSubject, filter } from 'rxjs';
import { AuthEvent, AuthEventType } from './types/auth.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

// Create a logger for the auth bridge
const logger = getLogger();

// Create a subject to publish auth events
const authEvents$ = new BehaviorSubject<AuthEvent | null>(null);

// Subscribe to auth events (filtered by type if specified)
export const subscribeToAuthEvents = (
  handler: (event: AuthEvent) => void,
  eventType?: AuthEventType
) => {
  const subscription = authEvents$.pipe(
    filter(event => !!event), // Filter out null events
    filter(event => !eventType || (event as AuthEvent).type === eventType) // Filter by event type if specified
  ).subscribe(event => {
    handler(event as AuthEvent);
  });

  // Return unsubscribe function
  return () => subscription.unsubscribe();
};

// Publish an auth event
export const publishAuthEvent = (event: AuthEvent) => {
  logger.info(`Auth event published: ${event.type}`, {
    category: LogCategory.AUTH,
    source: 'AuthBridge',
    details: { eventType: event.type }
  });
  authEvents$.next(event);
};

// Helper functions for common auth events
export const notifyAuthReady = (payload: AuthEvent['payload']) => {
  publishAuthEvent({ type: 'AUTH_READY', payload });
};

export const notifySignIn = (payload: AuthEvent['payload']) => {
  publishAuthEvent({ type: 'AUTH_SIGNED_IN', payload });
};

export const notifySignOut = () => {
  publishAuthEvent({ type: 'AUTH_SIGNED_OUT' });
};

export const notifyUserUpdated = (user: AuthEvent['payload']['user']) => {
  publishAuthEvent({ type: 'AUTH_USER_UPDATED', payload: { user } });
};

export const notifySessionUpdated = (session: AuthEvent['payload']['session']) => {
  publishAuthEvent({ type: 'AUTH_SESSION_UPDATED', payload: { session } });
};

export const notifyAuthError = (error: string) => {
  publishAuthEvent({ type: 'AUTH_ERROR', payload: { error } });
};
