
import { LogLevel } from '@/shared/types/shared.types';
import { LOG_COLORS } from '../config';

export const mapLogLevelToColor = (level: LogLevel): string => {
  return LOG_COLORS[level] || '#000000';
};

// Map log levels to emoji
export const mapLogLevelToEmoji = (level: LogLevel): string => {
  const emojiMap: Record<LogLevel, string> = {
    trace: '🔍',
    debug: '🐞',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    fatal: '💀',
    success: '✅',
    critical: '🚨',
    silent: '🔇'
  };
  
  return emojiMap[level] || 'ℹ️';
};

// Map log levels to CSS class
export const mapLogLevelToClass = (level: LogLevel): string => {
  const classMap: Record<LogLevel, string> = {
    trace: 'text-gray-400',
    debug: 'text-blue-400',
    info: 'text-blue-500',
    warn: 'text-yellow-500',
    error: 'text-red-500',
    fatal: 'text-red-700 font-bold',
    success: 'text-green-500',
    critical: 'text-red-700 bg-red-100 font-bold',
    silent: ''
  };
  
  return classMap[level] || '';
};
