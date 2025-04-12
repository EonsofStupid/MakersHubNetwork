
import React from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { ProfileDisplay } from '@/app/components/profile/ProfileDisplay';

export default function Index() {
  const logger = useLogger('IndexPage', LogCategory.UI);

  React.useEffect(() => {
    logger.info('Index page mounted');
  }, [logger]);

  return (
    <div className="container mx-auto px-4 pt-8">
      <h1 className="text-4xl font-heading font-bold text-primary mb-8">Welcome to Makers Impulse</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-heading font-bold mb-4">Getting Started</h2>
          <p className="text-lg mb-4">
            This is your application home page. You can customize it as needed for your specific app requirements.
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Edit this page to create your app's landing experience</li>
            <li>Check out the admin section for management features</li>
            <li>Update your profile to personalize your account</li>
          </ul>
        </div>
        
        <div className="bg-background/20 backdrop-blur-xl border border-primary/30 rounded-lg p-6 shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]">
          <h2 className="text-2xl font-heading font-bold mb-4">Latest Updates</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-primary pl-4">
              <h3 className="text-lg font-medium">Boundary Structure Implemented</h3>
              <p className="text-sm text-muted-foreground">The application now uses a proper domain-oriented architecture with clear boundaries.</p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <h3 className="text-lg font-medium">Auth System Updated</h3>
              <p className="text-sm text-muted-foreground">Authentication now follows standard patterns with proper role-based access control.</p>
            </div>
            <div className="border-l-2 border-primary pl-4">
              <h3 className="text-lg font-medium">Admin Tools Enhanced</h3>
              <p className="text-sm text-muted-foreground">New administrative tools available for managing users, content, and settings.</p>
            </div>
          </div>
        </div>
      </div>
      
      <ProfileDisplay />
    </div>
  );
}
