import { AuthSession } from '@/components/auth/types';

const SESSION_STORAGE_KEY = 'auth_session_backup';

export const storeSessionLocally = (session: AuthSession | null) => {
  if (session) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
};

export const getStoredSession = (): AuthSession | null => {
  const stored = localStorage.getItem(SESSION_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};