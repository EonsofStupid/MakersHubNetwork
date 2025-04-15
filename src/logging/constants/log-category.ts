
import { LogCategory } from '@/shared/types/shared.types';

export const LOG_CATEGORIES = {
  RBAC: LogCategory.RBAC,
  AUTH: LogCategory.AUTH,
  ADMIN: LogCategory.ADMIN,
  SYSTEM: LogCategory.SYSTEM,
  THEME: LogCategory.THEME,
  APP: LogCategory.APP,
  UI: LogCategory.UI,
  API: LogCategory.API,
  CHAT: LogCategory.CHAT,
  DEBUG: LogCategory.DEBUG
} as const;

export { LogCategory };
