
import React from 'react';
import { Link } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export const NotFoundPage: React.FC = () => {
  const logger = useLogger('NotFoundPage', LogCategory.SYSTEM);
  
  React.useEffect(() => {
    logger.warn('User accessed non-existent route');
  }, [logger]);
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
      >
        Return Home
      </Link>
    </div>
  );
};
