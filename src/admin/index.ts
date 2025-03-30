
// Admin components
export { AdminLayout } from "./components/AdminLayout";
export { AdminSidebar } from "./components/AdminSidebar";
export { AdminHeader } from "./components/AdminHeader";
export { ImpulseAdminLayout } from "./components/layout/ImpulseAdminLayout";
export { AdminProvider, useAdmin } from "./context/AdminContext";

// Admin routes
export { AdminRoutes } from "./routes";

// Admin store
export { useAdminStore } from "./store/admin.store";
export { useAdminPreferences } from "./store/adminPreferences.store";

// Admin hooks
export { useAdminPermissions } from "./hooks/useAdminPermissions";
export { useAdminRoles } from "./hooks/useAdminRoles"; 

// Admin types - export each file separately to avoid naming conflicts
export * from "./types/build.types";
export * from "./types/content";
export * from "./types/dashboard";
export * from "./types/data-maestro";
export * from "./types/impulse.types";
export * from "./types/theme";
export * from "./types/tools.types";

// Admin utils
export * from "./utils/adminUtils";
export * from "./utils/permissions";
export * from "./utils/routeUtils";

// Admin atoms
export * from "./atoms";

// Admin page
export { default as AdminPage } from "../pages/Admin";
