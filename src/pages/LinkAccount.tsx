
import { useEffect } from 'react';
import { AccountLinking } from '@/components/auth/AccountLinking';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, LinkIcon } from 'lucide-react';
import { useAuth } from '@/auth/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function LinkAccount() {
  const logger = useLogger('LinkAccountPage', LogCategory.AUTH);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    logger.info('Link account page loaded');
  }, [logger]);

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background/80 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-small-primary/10 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
      
      <div className="w-full max-w-md flex flex-col gap-6 relative z-10">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/profile" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Link Accounts</h1>
          </div>
          <p className="text-muted-foreground text-center">
            Connect multiple accounts to enable seamless sign-in
          </p>
        </div>
        
        <AccountLinking />
      </div>
    </div>
  );
}
