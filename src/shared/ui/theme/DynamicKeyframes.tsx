
import { useEffect } from 'react';
import { useSiteTheme } from '@/shared/hooks/useSiteTheme';
import { useThemeStore } from '@/shared/stores/theme/store';

interface DynamicKeyframesProps {
  className?: string;
}

/**
 * Component that renders theme animations as keyframes in a style tag
 */
export function DynamicKeyframes({ className }: DynamicKeyframesProps) {
  const { theme } = useSiteTheme();
  const animations = useThemeStore(state => state.animations);
  const isLoaded = useThemeStore(state => state.isLoaded);

  useEffect(() => {
    if (!animations || !isLoaded) return;

    // Create or get existing style tag
    let styleTag = document.getElementById('theme-keyframes');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'theme-keyframes';
      document.head.appendChild(styleTag);
    }

    // Build keyframes CSS
    const keyframesCSS = Object.entries(animations || {})
      .map(([name, keyframes]) => `@keyframes ${name} { ${keyframes} }`)
      .join('\n');

    styleTag.textContent = keyframesCSS;

    // Cleanup function
    return () => {
      if (styleTag && styleTag.parentNode) {
        styleTag.parentNode.removeChild(styleTag);
      }
    };
  }, [animations, isLoaded]);

  return null;
}
