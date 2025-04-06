
import { useAtomValue } from 'jotai';
import { resolveComponentStylesAtom } from '../atoms/theme.atoms';

/**
 * Hook for components to efficiently access their theme styles
 * without re-rendering when unrelated theme parts change
 * 
 * @param componentName The name of the component in the theme
 * @param variant Optional variant name
 */
export function useComponentTheme(componentName: string, variant?: string) {
  const resolveComponentStyles = useAtomValue(resolveComponentStylesAtom);
  const styles = resolveComponentStyles(componentName);
  
  // Return base styles or variant if specified
  if (variant && styles.variants && styles.variants[variant]) {
    return {
      ...styles.base,
      ...styles.variants[variant]
    };
  }
  
  return styles.base || styles;
}
