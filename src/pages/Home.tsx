
import React from 'react';
import { MainNav } from '@/components/MainNav';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export default function HomePage() {
  const logger = useLogger('HomePage', LogCategory.UI);

  React.useEffect(() => {
    logger.info('Home page mounted');
    
    return () => {
      logger.info('Home page unmounted');
    };
  }, [logger]);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-6">Welcome to Impulsivity</h1>
        <p className="text-lg mb-8">
          Advanced admin interface with real-time editing and visual debugging tools.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6 bg-card border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Admin Dashboard</h2>
            <p>Powerful administration tools for managing your application.</p>
          </div>
          
          <div className="card p-6 bg-card border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Visual Editor</h2>
            <p>Edit your site's appearance directly in the browser.</p>
          </div>
          
          <div className="card p-6 bg-card border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Debug Tools</h2>
            <p>Integrated debugging tools to help identify and fix issues.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
