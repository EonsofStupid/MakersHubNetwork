
import { LogLevel, LOG_LEVEL_VALUES } from "@/shared/types/shared.types";

// Map log level names to their numeric values
export const getLogLevelValue = (level: LogLevel): number => {
  return LOG_LEVEL_VALUES[level] || 999;
};

// Check if a log level meets or exceeds a minimum level
export const isLogLevelAtLeast = (level: LogLevel, minLevel: LogLevel): boolean => {
  return getLogLevelValue(level) >= getLogLevelValue(minLevel);
};
