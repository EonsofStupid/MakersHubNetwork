
import React from 'react';
import { AdminSection } from '@/admin/components/layout/AdminSection';
import { AdminGrid } from '@/admin/components/layout/AdminGrid';
import { BuildApprovalWidget } from '@/admin/components/dashboard/BuildApprovalWidget';
import { StatsCards } from '@/admin/components/dashboard/StatsCards';
import { AdminFeatureSection } from '@/admin/components/dashboard/AdminFeatureSection';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { AdminTopNav } from '@/admin/components/navigation/AdminTopNav';
import { DashboardShortcuts } from '@/admin/components/dashboard/DashboardShortcuts';
import { ActiveUsersList } from '@/admin/components/dashboard/ActiveUsersList';
import { ReviewsOverview } from '@/admin/components/reviews/ReviewsOverview';
import { ReviewCard } from '@/admin/components/reviews/ReviewCard';
import { ReviewList } from '@/admin/components/reviews/ReviewList';
import componentRegistry from '@/admin/services/componentRegistry';

// Simple component to render headings with the specified level
const Heading = ({ level = 1, children, className = '', ...props }: any) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={className} {...props}>{children}</Tag>;
};

// Simple div component for layout structuring
const Div = (props: any) => <div {...props}>{props.children}</div>;

export function initializeComponentRegistry() {
  // Register all available components
  componentRegistry.registerComponent('AdminSection', AdminSection);
  componentRegistry.registerComponent('AdminGrid', AdminGrid);
  componentRegistry.registerComponent('BuildApprovalWidget', BuildApprovalWidget);
  componentRegistry.registerComponent('StatsCards', StatsCards);
  componentRegistry.registerComponent('AdminFeatureSection', AdminFeatureSection);
  componentRegistry.registerComponent('DashboardShortcuts', DashboardShortcuts);
  componentRegistry.registerComponent('AdminSidebar', AdminSidebar);
  componentRegistry.registerComponent('AdminTopNav', AdminTopNav);
  componentRegistry.registerComponent('ActiveUsersList', ActiveUsersList);
  componentRegistry.registerComponent('ReviewsOverview', ReviewsOverview);
  componentRegistry.registerComponent('ReviewCard', ReviewCard);
  componentRegistry.registerComponent('ReviewList', ReviewList);
  
  // Register basic HTML components
  componentRegistry.registerComponent('div', Div, {
    defaultProps: { className: '' }
  });
  
  componentRegistry.registerComponent('heading', Heading, {
    defaultProps: { level: 1, className: '' }
  });
  
  componentRegistry.registerComponent('span', 'span', {
    defaultProps: { className: '' }
  });
  
  console.log("Component registry initialized:", componentRegistry.getRegisteredComponents());
}
