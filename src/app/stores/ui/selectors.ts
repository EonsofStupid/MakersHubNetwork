import { UIState } from './types';

export const selectThemeMode = (state: UIState) => state.theme.mode;
export const selectAccentColor = (state: UIState) => state.theme.accentColor;
export const selectLayout = (state: UIState) => state.layout;
export const selectPreferences = (state: UIState) => state.preferences;
export const selectIsNavOpen = (state: UIState) => state.layout.isNavOpen;
export const selectContentWidth = (state: UIState) => state.layout.contentWidth; 