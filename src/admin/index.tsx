// Import styles first to ensure proper cascade
import '@/admin/styles/admin-core.css';
import '@/admin/styles/impulse-admin.css';
import '@/admin/styles/admin-topnav.css';
import '@/admin/styles/navigation.css';
import '@/admin/styles/sidebar-navigation.css';
import '@/admin/styles/dashboard-shortcuts.css';
import '@/admin/styles/drag-drop.css';
import '@/admin/theme/impulse/impulse-theme.css';

// Export components
import { AdminLayout } from './components/AdminLayout';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminTopNav } from './components/layout/AdminTopNav';
import { ImpulseAdminLayout } from './components/layout/ImpulseAdminLayout';
import { useAdminStore } from './store/admin.store';
import { AdminThemeProvider, useAdminTheme } from './theme/AdminThemeProvider';
import { useAdminChat, useAdminChatListener } from './hooks/useAdminChat';
import { useAdminPermissions } from './hooks/useAdminPermissions';
import { DashboardShortcuts } from './components/dashboard/DashboardShortcuts';
import { DragIndicator } from './components/ui/DragIndicator';

// Export admin UI components
export { AdminLayout };
export { AdminSidebar };
export { AdminTopNav };
export { ImpulseAdminLayout };
export { DashboardShortcuts };
export { DragIndicator };

// Export admin state and hooks
export { useAdminStore };
export { AdminThemeProvider, useAdminTheme };
export { useAdminChat, useAdminChatListener };
export { useAdminPermissions };

// Main admin dashboard
export default function AdminDashboard() {
  return (
    <ImpulseAdminLayout>
      <DashboardShortcuts />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Admin stats cards */}
        <div className="bg-card/30 backdrop-blur-md p-6 rounded-lg border border-border/20">
          <h2 className="font-medium text-lg mb-3">Platform Overview</h2>
          <div className="space-y-2">
            <p>Users: <span className="text-primary font-bold">1,245</span></p>
            <p>Builds: <span className="text-primary font-bold">386</span></p>
            <p>Active makers: <span className="text-primary font-bold">89</span></p>
          </div>
        </div>
        
        {/* Recent activity */}
        <div className="bg-card/30 backdrop-blur-md p-6 rounded-lg border border-border/20">
          <h2 className="font-medium text-lg mb-3">Recent Activity</h2>
          <div className="space-y-2">
            <p>New users today: <span className="text-primary font-bold">24</span></p>
            <p>New builds today: <span className="text-primary font-bold">8</span></p>
            <p>Reviews pending: <span className="text-primary font-bold">12</span></p>
          </div>
        </div>
      </div>
    </ImpulseAdminLayout>
  );
}
