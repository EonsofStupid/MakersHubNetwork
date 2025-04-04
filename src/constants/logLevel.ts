
// Re-export log level and category constants from the canonical source
import { LogLevel, LogCategory } from '@/logging/types';

export { LogLevel, LogCategory };

// Re-export utility functions from the canonical source
export { 
  isLogLevelAtLeast, 
  getLogLevelColorClass, 
  LOG_LEVEL_NAMES 
} from '@/logging/constants/logLevel';
