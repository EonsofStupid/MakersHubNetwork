
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
  
  // Extract effect colors
  const effects = theme.design_tokens?.effects || {};
  if (effects && typeof effects === 'object' && 'primary' in effects) variables['--site-effect-color'] = String(effects.primary);
  if (effects && typeof effects === 'object' && 'secondary' in effects) variables['--site-effect-secondary'] = String(effects.secondary);
  if (effects && typeof effects === 'object' && 'tertiary' in effects) variables['--site-effect-tertiary'] = String(effects.tertiary);
  
  // Extract animation durations
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
  
  // Convert to standard Tailwind CSS variables
  variables['--background'] = `hsl(${variables['--site-background'] || '228 47% 8%'})`;
  variables['--foreground'] = `hsl(${variables['--site-foreground'] || '210 40% 98%'})`;
  variables['--card'] = `hsl(${variables['--site-card'] || '228 47% 11%'})`;
  variables['--card-foreground'] = `hsl(${variables['--site-card-foreground'] || '210 40% 98%'})`;
  variables['--popover'] = variables['--card'];
  variables['--popover-foreground'] = variables['--card-foreground'];
  variables['--primary'] = `hsl(${variables['--site-primary'] || '186 100% 50%'})`;
  variables['--primary-foreground'] = `hsl(${variables['--site-primary-foreground'] || '210 40% 98%'})`;
  variables['--secondary'] = `hsl(${variables['--site-secondary'] || '334 100% 59%'})`;
  variables['--secondary-foreground'] = `hsl(${variables['--site-secondary-foreground'] || '210 40% 98%'})`;
  variables['--muted'] = `hsl(${variables['--site-muted'] || '228 47% 15%'})`;
  variables['--muted-foreground'] = `hsl(${variables['--site-muted-foreground'] || '215 20.2% 65.1%'})`;
  variables['--accent'] = `hsl(${variables['--site-accent'] || '228 47% 15%'})`;
  variables['--accent-foreground'] = `hsl(${variables['--site-accent-foreground'] || '210 40% 98%'})`;
  variables['--destructive'] = `hsl(${variables['--site-destructive'] || '0 84.2% 60.2%'})`;
  variables['--destructive-foreground'] = `hsl(${variables['--site-destructive-foreground'] || '210 40% 98%'})`;
  variables['--border'] = `hsl(${variables['--site-border'] || '228 47% 15%'})`;
  variables['--input'] = `hsl(${variables['--site-input'] || '228 47% 15%'})`;
  variables['--ring'] = `hsl(${variables['--site-ring'] || '228 47% 20%'})`;
  
  // Add Impulse-specific variables
  variables['--impulse-primary'] = effects && typeof effects === 'object' && 'primary' in effects ? String(effects.primary) : '#00F0FF';
  variables['--impulse-secondary'] = effects && typeof effects === 'object' && 'secondary' in effects ? String(effects.secondary) : '#FF2D6E';
  variables['--impulse-bg-main'] = '#080F1E';
  variables['--impulse-text-primary'] = '#F9FAFB';
  
  return variables;
}
