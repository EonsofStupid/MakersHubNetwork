
import { LogCategory } from '@/shared/types/shared.types';

// Map log categories to display names
export const LOG_CATEGORY_DISPLAY: Record<LogCategory, string> = {
  [LogCategory.ADMIN]: 'Admin',
  [LogCategory.AUTH]: 'Auth',
  [LogCategory.API]: 'API',
  [LogCategory.USER]: 'User',
  [LogCategory.UI]: 'UI',
  [LogCategory.APP]: 'App',
  [LogCategory.CHAT]: 'Chat',
  [LogCategory.SYSTEM]: 'System',
  [LogCategory.THEME]: 'Theme',
  [LogCategory.PERF]: 'Performance',
  [LogCategory.DEFAULT]: 'Default',
  [LogCategory.DATA]: 'Data',
  [LogCategory.BRIDGE]: 'Bridge',
  [LogCategory.CONTENT]: 'Content',
  [LogCategory.NETWORK]: 'Network',
  [LogCategory.DATABASE]: 'Database',
  [LogCategory.SECURITY]: 'Security',
  [LogCategory.PERFORMANCE]: 'Performance',
  [LogCategory.ANALYTICS]: 'Analytics'
};

// Map log categories to colors for display
export const LOG_CATEGORY_COLORS: Record<LogCategory, string> = {
  [LogCategory.ADMIN]: '#7c3aed',    // Purple
  [LogCategory.AUTH]: '#2563eb',     // Blue
  [LogCategory.API]: '#0ea5e9',      // Sky
  [LogCategory.USER]: '#10b981',     // Green
  [LogCategory.UI]: '#f59e0b',       // Amber
  [LogCategory.APP]: '#6366f1',      // Indigo
  [LogCategory.CHAT]: '#8b5cf6',     // Violet
  [LogCategory.SYSTEM]: '#475569',   // Gray
  [LogCategory.THEME]: '#ec4899',    // Pink
  [LogCategory.PERF]: '#f97316',     // Orange
  [LogCategory.DEFAULT]: '#71717a',  // Zinc
  [LogCategory.DATA]: '#0891b2',     // Cyan
  [LogCategory.BRIDGE]: '#4f46e5',   // Indigo
  [LogCategory.CONTENT]: '#16a34a',  // Green
  [LogCategory.NETWORK]: '#0284c7',  // Sky
  [LogCategory.DATABASE]: '#0369a1', // Blue
  [LogCategory.SECURITY]: '#b91c1c', // Red
  [LogCategory.PERFORMANCE]: '#f97316', // Orange
  [LogCategory.ANALYTICS]: '#059669'  // Green
};
