
import { ImpulseTheme } from '../types/impulse.types';

/**
 * Safely access a theme property with appropriate defaults
 * This helps prevent "possibly undefined" TypeScript errors
 */
export function getThemeColor(theme: ImpulseTheme | null | undefined, path: string, defaultValue: string = '#000000'): string {
  if (!theme || !theme.colors) return defaultValue;
  
  const parts = path.split('.');
  let current: any = theme.colors;
  
  for (let i = 0; i < parts.length; i++) {
    if (current === undefined || current === null) return defaultValue;
    current = current[parts[i]];
  }
  
  return typeof current === 'string' ? current : defaultValue;
}

/**
 * Safely access a theme effect property
 */
export function getThemeEffect(theme: ImpulseTheme | null | undefined, path: string, defaultValue: string = 'none'): string {
  if (!theme || !theme.effects) return defaultValue;
  
  const parts = path.split('.');
  let current: any = theme.effects;
  
  for (let i = 0; i < parts.length; i++) {
    if (current === undefined || current === null) return defaultValue;
    current = current[parts[i]];
  }
  
  return typeof current === 'string' ? current : defaultValue;
}

/**
 * Safely access a theme animation property
 */
export function getThemeAnimation(theme: ImpulseTheme | null | undefined, path: string, defaultValue: string = '300ms'): string {
  if (!theme || !theme.animation) return defaultValue;
  
  const parts = path.split('.');
  let current: any = theme.animation;
  
  for (let i = 0; i < parts.length; i++) {
    if (current === undefined || current === null) return defaultValue;
    current = current[parts[i]];
  }
  
  return typeof current === 'string' ? current : defaultValue;
}

/**
 * Safely access a theme component property
 */
export function getThemeComponent(theme: ImpulseTheme | null | undefined, path: string, defaultValue: string = ''): string {
  if (!theme || !theme.components) return defaultValue;
  
  const parts = path.split('.');
  let current: any = theme.components;
  
  for (let i = 0; i < parts.length; i++) {
    if (current === undefined || current === null) return defaultValue;
    current = current[parts[i]];
  }
  
  return typeof current === 'string' ? current : defaultValue;
}

/**
 * Safely access a theme typography property
 */
export function getThemeTypography(theme: ImpulseTheme | null | undefined, path: string, defaultValue: string | number = ''): string | number {
  if (!theme || !theme.typography) return defaultValue;
  
  const parts = path.split('.');
  let current: any = theme.typography;
  
  for (let i = 0; i < parts.length; i++) {
    if (current === undefined || current === null) return defaultValue;
    current = current[parts[i]];
  }
  
  return current ?? defaultValue;
}

/**
 * Safe type guard for determining if a value is a theme object
 */
export function isThemeObject(value: any): value is ImpulseTheme {
  return value && 
    typeof value === 'object' && 
    'colors' in value && 
    typeof value.colors === 'object' &&
    'primary' in value.colors;
}
