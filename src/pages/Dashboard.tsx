
import React from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

export default function Dashboard() {
  const logger = useLogger('Dashboard', { category: LogCategory.SYSTEM });
  
  logger.debug('Dashboard page rendered');
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to MakersImpulse</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
          <p className="text-muted-foreground">
            Welcome to your new dashboard! This is where you'll manage your 3D printing projects.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Recent Projects</h2>
          <p className="text-muted-foreground">
            You don't have any projects yet. Create your first project to get started.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Community</h2>
          <p className="text-muted-foreground">
            Connect with other makers and share your creations with the community.
          </p>
        </div>
      </div>
    </div>
  );
}
