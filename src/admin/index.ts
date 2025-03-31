
// Export admin components
export { AdminLayout } from "./components/AdminLayout";
export { AdminSidebar } from "./components/AdminSidebar";
export { AdminHeader } from "./components/AdminHeader";
export { ImpulseAdminLayout } from "./components/layout/ImpulseAdminLayout";
export { AdminProvider, useAdmin } from "./context/AdminContext";
export { AdminDashboard } from "./components/dashboard/AdminDashboard";

// Export admin routes
export { AdminRoutes } from "./routes";

// Export admin store
export { useAdminStore } from "./store/admin.store";
export { useAdminPreferences } from "./store/adminPreferences.store";

// Export admin hooks
export { useAdminPermissions } from "./hooks/useAdminPermissions";
export { useAdminRoles } from "./hooks/useAdminRoles"; 

// Export admin constants
export { AdminPermissions } from "./constants/permissions";

// Export admin types
export type { AdminPermissionValue } from "./constants/permissions";
export type { AdminPermission } from "./types/admin.types";
export type { AdminSection } from "./types/admin.types";
export type { AdminOverlayConfig } from "./types/admin.types";
export type { AdminThemeConfig } from "./types/admin.types";
export type { AdminUserData } from "./types/admin.types";
export type { AdminPreferences } from "./types/admin.types";

// Export from tools.types - this is the source of truth for AdminShortcut
export type { AdminShortcut } from "./types/tools.types";
export type { FrozenZone } from "./types/tools.types";
export type { DragAndDropItem } from "./types/tools.types";
export type { DragAndDropOptions } from "./types/tools.types";
export type { CyberEffect } from "./types/tools.types";
export type { AdminNotification } from "./types/tools.types";

// Export admin types from other files
export * from "./types/build.types";
export * from "./types/content";
export * from "./types/dashboard";
export * from "./types/data-maestro";
export * from "./types/impulse.types";
export * from "./types/theme";

// Export admin utils
export { hasAdminAccess, getPermissionGroups, sectionPermissionMap } from "./utils/adminUtils";
export { checkPermission, usePermissionCheck, getPermissionDisplayName } from "./utils/permissions";
export * from "./utils/routeUtils";

// Export admin atoms
export * from "./atoms";

// Export admin page
export { default as AdminPage } from "../pages/Admin";
