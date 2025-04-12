
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Settings, Users, FileText, 
  PieChart, Palette, Layers, AlertCircle, LogOut 
} from 'lucide-react';
import { useAdminStore } from '../store/admin.store';
import { useAdminPermissions } from '../hooks/useAdminPermissions';

const AdminSidebar: React.FC = () => {
  const { user, logout } = useAdminStore();
  const { hasRole } = useAdminPermissions();

  const navItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      path: '/admin/dashboard',
      requiredRoles: ['ADMIN', 'MODERATOR', 'SUPERADMIN']
    },
    {
      label: 'Users',
      icon: <Users size={18} />,
      path: '/admin/users',
      requiredRoles: ['ADMIN', 'SUPERADMIN']
    },
    {
      label: 'Content',
      icon: <FileText size={18} />,
      path: '/admin/content',
      requiredRoles: ['ADMIN', 'MODERATOR', 'SUPERADMIN']
    },
    {
      label: 'Analytics',
      icon: <PieChart size={18} />,
      path: '/admin/analytics',
      requiredRoles: ['ADMIN', 'SUPERADMIN']
    },
    {
      label: 'Layouts',
      icon: <Layers size={18} />,
      path: '/admin/layouts',
      requiredRoles: ['ADMIN', 'SUPERADMIN']
    },
    {
      label: 'Themes',
      icon: <Palette size={18} />,
      path: '/admin/themes',
      requiredRoles: ['ADMIN', 'SUPERADMIN']
    },
    {
      label: 'Settings',
      icon: <Settings size={18} />,
      path: '/admin/settings',
      requiredRoles: ['ADMIN', 'SUPERADMIN']
    },
    {
      label: 'Logs',
      icon: <AlertCircle size={18} />,
      path: '/admin/logs',
      requiredRoles: ['SUPERADMIN']
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    hasRole(item.requiredRoles)
  );

  return (
    <aside className="w-64 bg-background border-r border-border h-screen">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        {user && (
          <div className="text-sm text-muted-foreground mt-1">
            {user.display_name || user.email}
          </div>
        )}
      </div>
      
      <nav className="p-2">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-border">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
