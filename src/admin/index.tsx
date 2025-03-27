
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { ImpulseAdminLayout } from './components/layout/ImpulseAdminLayout';
import { useAdminStore } from './store/admin.store';
import { AdminThemeProvider, useAdminTheme } from './theme/AdminThemeProvider';
import { useAdminChat, useAdminChatListener } from './hooks/useAdminChat';
import { useAdminPermissions } from './hooks/useAdminPermissions';

// Admin Dashboard Routes
import Themes from './routes/themes/Themes';

// Export admin UI components
export { AdminLayout };
export { AdminSidebar };
export { AdminHeader };
export { ImpulseAdminLayout };

// Export admin state and hooks
export { useAdminStore };
export { AdminThemeProvider, useAdminTheme };
export { useAdminChat, useAdminChatListener };
export { useAdminPermissions };

// Export admin route components
export { Themes };

// Main admin router component
export default function AdminRouter() {
  return (
    <ImpulseAdminLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin stats cards */}
        <div className="bg-card/30 backdrop-blur-md p-6 rounded-lg border border-border/20">
          <h2 className="font-medium text-lg mb-3">Platform Overview</h2>
          <div className="space-y-2">
            <p>Users: <span className="text-primary font-bold">1,245</span></p>
            <p>Builds: <span className="text-primary font-bold">386</span></p>
            <p>Active makers: <span className="text-primary font-bold">89</span></p>
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="bg-card/30 backdrop-blur-md p-6 rounded-lg border border-border/20">
          <h2 className="font-medium text-lg mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-md text-sm">
              Review Builds
            </button>
            <button className="bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-md text-sm">
              Manage Users
            </button>
            <button className="bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-md text-sm">
              Edit Content
            </button>
          </div>
        </div>
      </div>
    </ImpulseAdminLayout>
  );
}
