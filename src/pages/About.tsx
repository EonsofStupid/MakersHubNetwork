
import React from 'react';
import { MainNav } from '@/components/MainNav';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export default function AboutPage() {
  const logger = useLogger('AboutPage', LogCategory.UI);

  React.useEffect(() => {
    logger.info('About page mounted');
    
    return () => {
      logger.info('About page unmounted');
    };
  }, [logger]);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-6">About Impulsivity</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Impulsivity is an advanced admin interface with powerful tools for content management,
            visual editing, and real-time debugging.
          </p>
          
          <h2>Key Features</h2>
          <ul>
            <li>Visual page editor with overlay debugging</li>
            <li>Advanced theme customization</li>
            <li>Role-based access control</li>
            <li>Integrated logging system</li>
            <li>Real-time admin dashboard</li>
          </ul>
          
          <h2>Technology Stack</h2>
          <p>
            Built with React, TypeScript, Tailwind CSS, and advanced state management
            using both Zustand and Jotai for global and component state.
          </p>
        </div>
      </main>
    </div>
  );
}
