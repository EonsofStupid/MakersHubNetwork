
// Main admin router
export { default } from '../pages/Admin';

// Export admin layout components
export { AdminLayout } from './components/layout/AdminLayout';
export { ImpulseAdminLayout } from './components/layout/ImpulseAdminLayout';
export { AdminHeader } from './components/AdminHeader';
export { AdminSidebar } from './components/AdminSidebar';

// Export admin UI components
export { CyberCard } from './components/ui/CyberCard';
export { SmartOverlay } from './components/overlay/SmartOverlay';
export { AdminInspector } from './components/inspector/AdminInspector';

// Export admin theme system
export { AdminThemeProvider, useAdminTheme } from './theme/AdminThemeProvider';
export { tokensToCssVars, applyCssVars, deepMerge } from './theme/utils/themeUtils';

// Export admin types
export * from './types/admin.types';
export * from './types/content';
export * from './types/dashboard';
export * from './types/data-maestro';
export * from './types/import';
export * from './types/queries';
export * from './types/theme';
export * from './types/impulse.types';

// Export admin stores
export { useAdminStore } from './store/admin.store';
export { useAdminPreferences } from './store/adminPreferences.store';
export { useImpulseStore } from './store/impulse.store';

// Export atoms
export * from './store/atoms/inspector.atoms';
export * from './store/atoms/overlay.atoms';
export * from './store/atoms/ui.atoms';
