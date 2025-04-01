
import React from 'react';
import componentRegistry from '@/admin/services/componentRegistry';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { AdminTopNav } from '@/admin/components/navigation/AdminTopNav';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { DashboardShortcuts } from '@/admin/components/dashboard/DashboardShortcuts';
import { BuildApprovalWidget } from '@/components/admin/dashboard/BuildApprovalWidget';
import { AdminFeatureSection } from '@/components/admin/dashboard/AdminFeatureSection';
import { StatsCards } from '@/admin/components/dashboard/StatsCards';
import { ActiveUsersList } from '@/admin/dashboard/ActiveUsersList';
import { PerformanceMetrics } from '@/admin/dashboard/PerformanceMetrics';
import { TrendingParts } from '@/admin/dashboard/TrendingParts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/admin/components/dashboard/DashboardLayout';

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

// Basic HTML elements
function Span({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={className} {...props}>{children}</span>;
}

function Div({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}

function Heading({ level = 1, children, className, ...props }: { level?: 1 | 2 | 3 | 4 | 5 | 6 } & React.HTMLAttributes<HTMLHeadingElement>) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={className} {...props}>{children}</Tag>;
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
  
  // Register basic HTML elements
  componentRegistry.registerBulk({
    span: {
      component: Span,
      defaultProps: { className: '' },
    },
    div: {
      component: Div,
      defaultProps: { className: '' },
    },
    heading: {
      component: Heading,
      defaultProps: { level: 1, className: 'text-2xl font-bold' },
    },
  });
  
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
      defaultProps: { cols: 3 },
    },
    DashboardLayout: {
      component: DashboardLayout,
      permissions: ['admin:view'],
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
    Badge: {
      component: Badge,
    },
    Button: {
      component: Button,
      defaultProps: { variant: 'default', size: 'default' },
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
