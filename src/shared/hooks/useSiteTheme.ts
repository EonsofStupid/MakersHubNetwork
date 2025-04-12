
import { useThemeStore } from '@/shared/stores/theme/store';

export function useSiteTheme() {
  const theme = useThemeStore(state => state.theme);
  const variables = useThemeStore(state => state.variables);
  const componentStyles = useThemeStore(state => state.componentStyles);
  const isLoaded = useThemeStore(state => state.isLoaded);
  const animations = useThemeStore(state => state.componentTokens)
    .find(component => component.component_name === 'animations')?.styles || {};

  return {
    theme,
    variables,
    componentStyles,
    animations,
    isLoaded
  };
}
