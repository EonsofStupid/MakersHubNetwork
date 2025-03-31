
import React from "react";
import { DashboardShortcuts } from './DashboardShortcuts';
import { ImpulseAdminLayout } from '../layout/ImpulseAdminLayout';

export function AdminDashboard() {
  return (
    <ImpulseAdminLayout>
      <DashboardShortcuts />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Admin stats cards */}
        <div className="glassmorphism p-6 rounded-lg border border-[var(--impulse-border-normal)] cyber-effect-1">
          <h2 className="font-medium text-lg mb-3 cyber-text">Platform Overview</h2>
          <div className="space-y-2">
            <p>Users: <span className="text-[var(--impulse-primary)] font-bold">1,245</span></p>
            <p>Builds: <span className="text-[var(--impulse-primary)] font-bold">386</span></p>
            <p>Active makers: <span className="text-[var(--impulse-primary)] font-bold">89</span></p>
          </div>
        </div>
        
        {/* Recent activity */}
        <div className="glassmorphism p-6 rounded-lg border border-[var(--impulse-border-normal)] cyber-effect-2">
          <h2 className="font-medium text-lg mb-3 cyber-text">Recent Activity</h2>
          <div className="space-y-2">
            <p>New users today: <span className="text-[var(--impulse-primary)] font-bold">24</span></p>
            <p>New builds today: <span className="text-[var(--impulse-primary)] font-bold">8</span></p>
            <p>Reviews pending: <span className="text-[var(--impulse-primary)] font-bold">12</span></p>
          </div>
        </div>
      </div>
    </ImpulseAdminLayout>
  );
}
