
import { atom } from 'jotai';
import { Theme, ComponentTokens, ThemeContext } from '@/types/theme';

// Component-level theme override atoms
export const themeIdAtom = atom<string | null>(null);
export const themeModeAtom = atom<'light' | 'dark'>('dark');
export const themeContextAtom = atom<ThemeContext>('site');
export const componentOverridesAtom = atom<Record<string, Record<string, unknown>>>({});

// Component-specific override atoms
export const buttonStylesAtom = atom<Record<string, unknown>>({});
export const cardStylesAtom = atom<Record<string, unknown>>({});
export const navbarStylesAtom = atom<Record<string, unknown>>({});

// Theme loading state atoms
export const themeLoadingAtom = atom<boolean>(false);
export const themeErrorAtom = atom<Error | null>(null);
export const themeInitializedAtom = atom<boolean>(false);

// Current theme data atoms
export const currentThemeAtom = atom<Theme | null>(null);
export const themeComponentsAtom = atom<ComponentTokens[]>([]);
export const themeVariablesAtom = atom<Record<string, string>>({});

// Component-specific theme resolver atom
export const resolveComponentStylesAtom = atom(
  (get) => (componentName: string) => {
    const currentTheme = get(currentThemeAtom);
    const overrides = get(componentOverridesAtom);
    
    // Base component styles from theme
    const baseStyles = currentTheme?.component_tokens
      ?.find(c => c.component_name === componentName)?.styles || {};
      
    // Component-specific overrides
    const componentOverrides = overrides[componentName] || {};
    
    // Merge and return
    return { ...baseStyles, ...componentOverrides };
  }
);

// Derived state: Is dark mode active?
export const isDarkModeAtom = atom(
  (get) => get(themeModeAtom) === 'dark'
);
