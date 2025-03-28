
import { UIState } from './types';

// Theme selectors
export const selectThemeMode = (state: UIState) => state.theme.mode;
export const selectAccentColor = (state: UIState) => state.theme.accentColor;

// Layout selectors
export const selectLayout = (state: UIState) => state.layout;
export const selectIsNavOpen = (state: UIState) => state.layout.isNavOpen;
export const selectContentWidth = (state: UIState) => state.layout.contentWidth;

// Preference selectors
export const selectPreferences = (state: UIState) => state.preferences;

// Feature selectors
export const selectFeatures = (state: UIState) => state.features;
export const selectShowcasedBuildsCount = (state: UIState) => state.features.showcasedBuilds;
export const selectAnimationsEnabled = (state: UIState) => state.features.animationsEnabled;
export const selectExtendedInfo = (state: UIState) => state.features.extendedInfo;

// Admin selectors
export const selectAdminSidebarExpanded = (state: UIState) => state.admin.sidebarExpanded;
export const selectAdminActiveSection = (state: UIState) => state.admin.activeSection;
export const selectAdminOverlayVisible = (state: UIState) => state.admin.overlayVisible;
export const selectAdminInspectorEnabled = (state: UIState) => state.admin.inspectorEnabled;
