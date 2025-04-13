
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Shield, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LOG_CATEGORY } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';

export const AccessDenied: React.FC = () => {
  const logger = useLogger('AccessDenied', LOG_CATEGORY.AUTH);
  
  // Log access denied
  React.useEffect(() => {
    logger.warn('Access denied to protected route');
  }, [logger]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/10 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="bg-destructive/10 text-destructive">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Denied
          </CardTitle>
          <CardDescription className="text-destructive/80">
            You don't have permission to access this resource
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-6 text-muted-foreground">
            If you believe this is an error, please contact your administrator
            or try logging in with an account that has the necessary permissions.
          </p>
          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
