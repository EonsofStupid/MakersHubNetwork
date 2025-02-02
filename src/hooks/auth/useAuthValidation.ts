import { checkRateLimit } from '@/utils/rateLimiting';
import { validateSession } from '@/utils/auth/securityHandlers';

const MAX_AUTH_ATTEMPTS = 3;
const AUTH_WINDOW = '5 minutes';

export const useAuthValidation = () => {
  const validateAuthAttempt = async (session: any) => {
    try {
      const [isValid, withinLimit] = await Promise.all([
        validateSession(session),
        checkRateLimit(session.user.id, 'auth_operation', MAX_AUTH_ATTEMPTS, AUTH_WINDOW)
      ]);

      if (!isValid || !withinLimit) {
        throw new Error(
          !isValid ? 'Invalid session' : 'Too many auth attempts. Please try again later.'
        );
      }

      return true;
    } catch (error) {
      console.error('Auth validation error:', error);
      throw error;
    }
  };

  return { validateAuthAttempt };
};