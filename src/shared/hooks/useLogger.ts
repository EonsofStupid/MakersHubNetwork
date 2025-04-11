
import { LogCategory } from "@/shared/types/logging";

export interface LoggerOptions {
  category?: LogCategory;
  source?: string;
  details?: Record<string, any>;
}

export function useLogger(source: string, category: LogCategory = LogCategory.APP) {
  const log = (message: string, options?: LoggerOptions) => {
    console.log(`[${category}][${source}] ${message}`, options?.details || {});
  };

  const debug = (message: string, options?: LoggerOptions) => {
    console.debug(`[${category}][${source}] ${message}`, options?.details || {});
  };

  const info = (message: string, options?: LoggerOptions) => {
    console.info(`[${category}][${source}] ${message}`, options?.details || {});
  };

  const warn = (message: string, options?: LoggerOptions) => {
    console.warn(`[${category}][${source}] ${message}`, options?.details || {});
  };

  const error = (message: string, options?: LoggerOptions) => {
    console.error(`[${category}][${source}] ${message}`, options?.details || {});
  };

  return {
    log,
    debug,
    info,
    warn,
    error
  };
}
