
import { LogCategory } from '@/shared/types/shared.types';

// Export the LogCategory enum directly
export { LogCategory };

// Map of category labels for UI display
export const LOG_CATEGORY_LABELS: Record<LogCategory, string> = {
  [LogCategory.APP]: 'App',
  [LogCategory.ADMIN]: 'Admin',
  [LogCategory.AUTH]: 'Auth',
  [LogCategory.API]: 'API',
  [LogCategory.USER]: 'User',
  [LogCategory.UI]: 'UI',
  [LogCategory.CHAT]: 'Chat',
  [LogCategory.SYSTEM]: 'System',
  [LogCategory.THEME]: 'Theme',
  [LogCategory.PERF]: 'Performance',
  [LogCategory.DEFAULT]: 'Default',
  [LogCategory.DATA]: 'Data',
  [LogCategory.BRIDGE]: 'Bridge',
  [LogCategory.CONTENT]: 'Content', 
  [LogCategory.NETWORK]: 'Network'
};
