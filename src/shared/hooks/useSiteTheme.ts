
import { useThemeStore } from '@/shared/stores/theme/store';

export function useSiteTheme() {
  // Using optional chaining to handle potentially undefined properties
  const theme = useThemeStore(state => state.theme);
  const variables = useThemeStore(state => state.variables);
  const componentStyles = useThemeStore(state => state.componentStyles);
  const isLoaded = useThemeStore(state => state.isLoaded);
  
  // Handle animations specifically
  let animations = {};
  if (componentStyles && 'animations' in componentStyles) {
    animations = componentStyles.animations || {};
  }

  return {
    theme,
    variables,
    componentStyles,
    animations,
    isLoaded
  };
}
