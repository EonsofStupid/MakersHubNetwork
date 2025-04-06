
import { Theme } from '@/types/theme';

/**
 * Convert theme values to CSS variables
 */
export function cssVariablesFromTheme(theme: Theme): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // Extract colors
  const colors = theme.design_tokens?.colors || {};
  Object.entries(colors).forEach(([key, value]) => {
    variables[`--site-${key}`] = String(value);
  });
  
  // Extract effect colors with type safety
  const effects = theme.design_tokens?.effects || {};
  const effectsObj = effects as Record<string, unknown>;
  
  if (effectsObj && typeof effectsObj === 'object') {
    // Handle effect primary color with fallback
    if ('primary' in effectsObj && effectsObj.primary) {
      variables['--site-effect-color'] = String(effectsObj.primary);
    } else {
      variables['--site-effect-color'] = '#00F0FF'; // Default fallback
    }
    
    // Handle effect secondary color with fallback
    if ('secondary' in effectsObj && effectsObj.secondary) {
      variables['--site-effect-secondary'] = String(effectsObj.secondary);
    } else {
      variables['--site-effect-secondary'] = '#FF2D6E'; // Default fallback
    }
    
    // Handle effect tertiary color with fallback
    if ('tertiary' in effectsObj && effectsObj.tertiary) {
      variables['--site-effect-tertiary'] = String(effectsObj.tertiary);
    } else {
      variables['--site-effect-tertiary'] = '#8B5CF6'; // Default fallback
    }
  }
  
  // Extract animation durations with fallbacks
  const durations = theme.design_tokens?.animation?.durations || {};
  Object.entries(durations).forEach(([key, value]) => {
    variables[`--site-${key}`] = String(value);
  });
  
  // Extract radius values from spacing
  const radius = theme.design_tokens?.spacing?.radius || {};
  if (typeof radius === 'object') {
    Object.entries(radius).forEach(([key, value]) => {
      variables[`--site-radius-${key}`] = String(value);
    });
  }
  
  // Default values for missing variables
  const defaults = {
    background: '228 47% 8%',
    foreground: '210 40% 98%',
    card: '228 47% 11%',
    cardForeground: '210 40% 98%',
    primary: '186 100% 50%',
    primaryForeground: '210 40% 98%',
    secondary: '334 100% 59%',
    secondaryForeground: '210 40% 98%',
    muted: '228 47% 15%',
    mutedForeground: '215 20.2% 65.1%',
    accent: '228 47% 15%',
    accentForeground: '210 40% 98%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '210 40% 98%',
    border: '228 47% 15%',
    input: '228 47% 15%',
    ring: '228 47% 20%'
  };
  
  // Convert to standard Tailwind CSS variables with fallbacks
  Object.entries(defaults).forEach(([key, defaultValue]) => {
    const varName = `--${key}`;
    const siteVarName = `--site-${key}`;
    variables[varName] = `hsl(${variables[siteVarName] || defaultValue})`;
  });
  
  // Special handling for popover that mirrors card
  variables['--popover'] = variables['--card'];
  variables['--popover-foreground'] = variables['--card-foreground'];
  
  // Add Impulse-specific variables with fallbacks
  variables['--impulse-primary'] = (effectsObj && 'primary' in effectsObj) ? String(effectsObj.primary) : '#00F0FF';
  variables['--impulse-secondary'] = (effectsObj && 'secondary' in effectsObj) ? String(effectsObj.secondary) : '#FF2D6E';
  variables['--impulse-bg-main'] = '#080F1E';
  variables['--impulse-text-primary'] = '#F9FAFB';
  
  return variables;
}
