
import React from 'react';
import componentRegistry from '@/admin/services/componentRegistry';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { AdminTopNav } from '@/admin/components/navigation/AdminTopNav';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { DashboardShortcuts } from '@/admin/components/dashboard/DashboardShortcuts';
import { BuildApprovalWidget } from '@/components/admin/dashboard/BuildApprovalWidget';
import { AdminFeatureSection } from '@/components/admin/dashboard/AdminFeatureSection';
import { StatsCards } from '@/admin/dashboard/StatsCards';
import { ActiveUsersList } from '@/admin/dashboard/ActiveUsersList';
import { PerformanceMetrics } from '@/admin/dashboard/PerformanceMetrics';
import { TrendingParts } from '@/admin/dashboard/TrendingParts';

// Fallback component for unregistered components
function UnregisteredComponent({ type, ...props }: { type: string; [key: string]: any }) {
  return (
    <div className="p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
      <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
        Component Not Found: {type}
      </div>
      <pre className="mt-2 text-xs overflow-auto max-h-40">
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  );
}

// Layout components
function AdminContainer({ children, title }: { children: React.ReactNode; title?: string }) {
  return <AdminLayout title={title}>{children}</AdminLayout>;
}

function AdminSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-6 ${className || ''}`}>{children}</div>;
}

function AdminGrid({ children, cols = 3, className }: { children: React.ReactNode; cols?: number; className?: string }) {
  return (
    <div 
      className={`grid grid-cols-1 ${
        cols === 2 ? 'md:grid-cols-2' : 
        cols === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 
        cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : ''
      } gap-6 ${className || ''}`}
    >
      {children}
    </div>
  );
}

// Initialize component registry
export function initializeComponentRegistry() {
  // Set fallback component
  componentRegistry.setFallbackComponent(UnregisteredComponent);
  
  // Register layout components
  componentRegistry.registerBulk({
    // Core layout components
    AdminLayout: {
      component: AdminContainer,
      permissions: ['admin:access'],
    },
    AdminSection: {
      component: AdminSection,
    },
    AdminGrid: {
      component: AdminGrid,
    },
    AdminTopNav: {
      component: AdminTopNav,
      permissions: ['admin:access'],
    },
    AdminSidebar: {
      component: AdminSidebar,
      permissions: ['admin:access'],
    },

    // UI components
    Card: {
      component: Card,
    },
    CardHeader: {
      component: CardHeader,
    },
    CardTitle: {
      component: CardTitle,
    },
    CardDescription: {
      component: CardDescription,
    },
    CardContent: {
      component: CardContent,
    },
    CardFooter: {
      component: CardFooter,
    },

    // Admin dashboard components
    DashboardShortcuts: {
      component: DashboardShortcuts,
      permissions: ['admin:view'],
    },
    BuildApprovalWidget: {
      component: BuildApprovalWidget,
      permissions: ['builds:view'],
    },
    AdminFeatureSection: {
      component: AdminFeatureSection,
      permissions: ['admin:view'],
    },
    StatsCards: {
      component: StatsCards,
      permissions: ['admin:view'],
    },
    ActiveUsersList: {
      component: ActiveUsersList,
      permissions: ['users:view'],
    },
    PerformanceMetrics: {
      component: PerformanceMetrics,
      permissions: ['admin:view'],
    },
    TrendingParts: {
      component: TrendingParts,
      permissions: ['admin:view'],
    },
  });
  
  console.log('Component registry initialized with admin components');
}
