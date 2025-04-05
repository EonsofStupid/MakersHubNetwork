
export enum LogCategory {
  AUTH = 'auth',
  ADMIN = 'admin',
  UI = 'ui',
  API = 'api',
  DATA = 'data',
  SYSTEM = 'system',
  PERFORMANCE = 'performance',
  USER = 'user'
}

export function getLogger() {
  // Simple logger implementation
  return {
    info: (message: string, details?: any) => console.info(`[INFO] ${message}`, details ?? ''),
    warn: (message: string, details?: any) => console.warn(`[WARN] ${message}`, details ?? ''),
    error: (message: string, details?: any) => console.error(`[ERROR] ${message}`, details ?? ''),
    debug: (message: string, details?: any) => console.debug(`[DEBUG] ${message}`, details ?? '')
  };
}
