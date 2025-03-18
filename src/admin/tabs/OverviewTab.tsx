
import React from 'react';
import { OverviewTab as OverviewTabComponent } from '@/admin/dashboard/OverviewTab';

/**
 * Admin Overview Tab
 * This is a wrapper component that re-exports the OverviewTab from the dashboard directory.
 * It exists to maintain a consistent import structure across admin tabs.
 */
const OverviewTab = () => {
  return <OverviewTabComponent />;
};

// Export both as named export and default export for maximum compatibility
export { OverviewTab };
export default OverviewTab;
