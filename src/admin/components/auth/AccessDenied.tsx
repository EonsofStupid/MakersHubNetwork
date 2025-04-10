
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

interface AccessDeniedProps {
  missingRole?: string | string[];
}

export function AccessDenied({ missingRole }: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card w-full max-w-md p-6 rounded-lg border border-primary/20 shadow-lg">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          
          <p className="text-muted-foreground">
            You don't have permission to access this area.
            {missingRole && (
              <>
                <br />
                <span className="text-sm font-medium text-destructive mt-1 block">
                  Required role: {Array.isArray(missingRole) ? missingRole.join(', ') : missingRole}
                </span>
              </>
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </Button>
            
            <Button 
              variant="default" 
              className="flex items-center gap-2"
              asChild
            >
              <Link to={-1 as any}>
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
