
import { LogCategory } from '@/shared/types/shared.types';

export { LogCategory } from '@/shared/types/shared.types';

export const LOG_CATEGORY_COLORS: Record<LogCategory, string> = {
  [LogCategory.APP]: 'bg-blue-100 text-blue-800',
  [LogCategory.ADMIN]: 'bg-purple-100 text-purple-800',
  [LogCategory.AUTH]: 'bg-indigo-100 text-indigo-800',
  [LogCategory.API]: 'bg-green-100 text-green-800',
  [LogCategory.USER]: 'bg-yellow-100 text-yellow-800',
  [LogCategory.UI]: 'bg-pink-100 text-pink-800',
  [LogCategory.CHAT]: 'bg-teal-100 text-teal-800',
  [LogCategory.CONTENT]: 'bg-amber-100 text-amber-800',
  [LogCategory.SYSTEM]: 'bg-gray-100 text-gray-800',
  [LogCategory.THEME]: 'bg-cyan-100 text-cyan-800',
  [LogCategory.NETWORK]: 'bg-emerald-100 text-emerald-800',
  [LogCategory.PERFORMANCE]: 'bg-orange-100 text-orange-800'
};
