
import { Theme } from '@/types/theme';
import { getLogger } from '@/logging/service/logger.service';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('TypeUtils', { category: LogCategory.THEME });

/**
 * Check if a value is a valid ImpulseTheme
 */
export function isImpulseTheme(value: any): value is ImpulseTheme {
  if (!value || typeof value !== 'object') {
    return false;
  }
  
  // Check for required properties
  const requiredProperties = ['id', 'name', 'colors', 'typography', 'effects', 'animation'];
  if (!requiredProperties.every(prop => prop in value)) {
    return false;
  }
  
  // Check for required nested properties
  if (!value.colors.primary || 
      !value.colors.background || 
      !value.colors.text || 
      !value.typography.fonts) {
    return false;
  }
  
  return true;
}

/**
 * Safe type assertion for ImpulseTheme
 */
export function asImpulseTheme(value: any): ImpulseTheme | null {
  try {
    if (isImpulseTheme(value)) {
      return value as ImpulseTheme;
    }
    return null;
  } catch (error) {
    logger.error('Error asserting ImpulseTheme type', {
      details: safeDetails(error)
    });
    return null;
  }
}

/**
 * Check if a theme is a database theme
 */
export function isDbTheme(value: any): value is Theme {
  if (!value || typeof value !== 'object') {
    return false;
  }
  
  // Check for required properties that are specific to DB themes
  const requiredProperties = ['id', 'name', 'status', 'design_tokens', 'created_at', 'updated_at'];
  if (!requiredProperties.every(prop => prop in value)) {
    return false;
  }
  
  return true;
}

/**
 * Safe conversion from any to Theme type
 */
export function asDbTheme(value: any): Theme | null {
  try {
    if (isDbTheme(value)) {
      return value as Theme;
    }
    return null;
  } catch (error) {
    logger.error('Error asserting Theme type', {
      details: safeDetails(error)
    });
    return null;
  }
}

/**
 * Safely extract a property from an object with type checking
 */
export function getTypeSafeProperty<T>(obj: any, key: string, fallback: T): T {
  if (!obj || typeof obj !== 'object' || !(key in obj)) {
    return fallback;
  }
  
  const value = obj[key];
  
  // Type checking based on fallback type
  if (typeof value === typeof fallback) {
    return value as T;
  }
  
  return fallback;
}
