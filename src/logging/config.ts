
import { LogLevel, LogCategory } from './types';
import { consoleTransport } from './transports/console-transport';
import { memoryTransport } from './transports/memory-transport';
import { LoggingConfig } from './types';

// Default configuration
const defaultConfig: LoggingConfig = {
  minLevel: LogLevel.DEBUG,
  defaultCategory: LogCategory.DEFAULT,
  enabledCategories: Object.values(LogCategory),
  transports: [
    consoleTransport,
    memoryTransport
  ]
};

// Development configuration
const devConfig: LoggingConfig = {
  ...defaultConfig,
  minLevel: LogLevel.DEBUG
};

// Production configuration
const prodConfig: LoggingConfig = {
  ...defaultConfig,
  minLevel: LogLevel.INFO,
  transports: [
    memoryTransport,
    {
      log: (entry) => {
        // In production, only log warnings and above to console
        if ([LogLevel.WARN, LogLevel.ERROR, LogLevel.CRITICAL].includes(entry.level)) {
          consoleTransport.log(entry);
        }
      },
      clear: () => consoleTransport.clear()
    }
  ]
};

// Test configuration
const testConfig: LoggingConfig = {
  ...defaultConfig,
  minLevel: LogLevel.SILENT, // Don't log in tests by default
};

// Export configuration based on environment
let currentConfig: LoggingConfig;

switch (process.env.NODE_ENV) {
  case 'production':
    currentConfig = prodConfig;
    break;
  case 'test':
    currentConfig = testConfig;
    break;
  default:
    currentConfig = devConfig;
}

// Getter for the current config
export function getConfig(): LoggingConfig {
  return currentConfig;
}

// Update the configuration
export function updateConfig(updates: Partial<LoggingConfig>): LoggingConfig {
  currentConfig = { ...currentConfig, ...updates };
  return currentConfig;
}

// Configure log filtering
export function setLogFilter({
  showDebug = true,
  showInfo = true,
  showWarning = true,
  showError = true,
  showCritical = true,
}: {
  showDebug?: boolean;
  showInfo?: boolean;
  showWarning?: boolean;
  showError?: boolean;
  showCritical?: boolean;
}): void {
  const enabledLevels: LogLevel[] = [];
  
  if (showDebug) enabledLevels.push(LogLevel.DEBUG);
  if (showInfo) enabledLevels.push(LogLevel.INFO);
  if (showWarning) enabledLevels.push(LogLevel.WARN);
  if (showError) enabledLevels.push(LogLevel.ERROR);
  if (showCritical) enabledLevels.push(LogLevel.CRITICAL);
  
  // Custom log filtering logic can be implemented here
  console.log('Log filter updated', enabledLevels);
}
