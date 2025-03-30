
// Export admin components
export { AdminLayout } from "./components/AdminLayout";
export { AdminSidebar } from "./components/AdminSidebar";
export { AdminHeader } from "./components/AdminHeader";
export { ImpulseAdminLayout } from "./components/layout/ImpulseAdminLayout";
export { AdminProvider, useAdmin } from "./context/AdminContext";

// Export admin routes
export { AdminRoutes } from "./routes";

// Export admin store
export { useAdminStore } from "./store/admin.store";
export { useAdminPreferences } from "./store/adminPreferences.store";

// Export admin hooks
export { useAdminPermissions } from "./hooks/useAdminPermissions";
export { useAdminRoles } from "./hooks/useAdminRoles"; 

// Export admin types
export * from "./types/admin.types";
export * from "./types/build.types";
export * from "./types/content";
export * from "./types/dashboard";
export * from "./types/data-maestro";
export * from "./types/impulse.types";
export * from "./types/theme";

// Explicitly rename conflicting types to avoid ambiguity
export { type AdminShortcut as AdminShortcutType } from "./types/tools.types";
export * from "./types/tools.types";

// Export admin utils
export * from "./utils/adminUtils";
export * from "./utils/permissions";
export * from "./utils/routeUtils";

// Export admin atoms
export * from "./atoms";

// Export admin page
export { default as AdminPage } from "../pages/Admin";
