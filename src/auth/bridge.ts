
import { create } from 'zustand';
import { User, Session, AuthStatus } from '@/types/auth';

// Define allowed event types for type safety
export type AuthEventType =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'SESSION_UPDATED'
  | 'INITIALIZED'
  | 'ERROR';

// Modified AuthEvent to implement Record<string, unknown>
export interface AuthEvent extends Record<string, unknown> {
  type: AuthEventType;
  payload?: Record<string, unknown>;
  timestamp?: number;
}

// Store for auth bridge
interface AuthBridgeStore {
  initialized: boolean;
  isReady: boolean;
  user: User | null;
  session: Session | null;
  status: AuthStatus;
  error: Error | null;
  events: AuthEvent[];

  // Actions
  dispatch: (event: AuthEvent) => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setStatus: (status: AuthStatus) => void;
  setError: (error: Error | null) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

export const useAuthBridge = create<AuthBridgeStore>((set, get) => ({
  initialized: false,
  isReady: false,
  user: null,
  session: null,
  status: AuthStatus.LOADING,
  error: null,
  events: [],

  dispatch: (event) => {
    set((state) => ({
      events: [...state.events, {
        ...event,
        timestamp: Date.now(),
      }],
    }));

    // Process events
    switch (event.type) {
      case 'SIGNED_IN':
        set({
          status: AuthStatus.AUTHENTICATED,
          user: event.payload?.user as User || null,
          session: event.payload?.session as Session || null,
        });
        break;

      case 'SIGNED_OUT':
        set({
          status: AuthStatus.UNAUTHENTICATED,
          user: null,
          session: null,
        });
        break;

      case 'USER_UPDATED':
        set({
          user: event.payload?.user as User || get().user,
        });
        break;

      case 'SESSION_UPDATED':
        set({
          session: event.payload?.session as Session || get().session,
        });
        break;

      case 'INITIALIZED':
        set({
          initialized: true,
          isReady: true,
        });
        break;

      case 'ERROR':
        set({
          error: event.payload?.error as Error || null,
          status: AuthStatus.ERROR,
        });
        break;

      default:
        break;
    }
  },

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setInitialized: (initialized) => set({ initialized }),

  reset: () => set({
    user: null,
    session: null,
    status: AuthStatus.LOADING,
    error: null,
    events: [],
  }),
}));
