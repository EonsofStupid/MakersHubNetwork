import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/types/shared';

interface AccessDeniedProps {
  missingRole?: UserRole | UserRole[];
}

export function AccessDenied({ missingRole }: AccessDeniedProps) {
  // Format missing role(s) for display
  const formatRoles = (roles?: UserRole | UserRole[]): string => {
    if (!roles) return '';
    
    if (Array.isArray(roles)) {
      if (roles.length === 1) return roles[0];
      if (roles.length === 2) return `${roles[0]} or ${roles[1]}`;
      return roles.slice(0, -1).join(', ') + ', or ' + roles[roles.length - 1];
    }
    
    return roles;
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background/80">
      <Card className="max-w-md w-full border-destructive/50">
        <CardHeader className="space-y-1 flex flex-col items-center text-center pb-2">
          <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription className="text-destructive">
            You don't have permission to access this area
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 text-center pt-2">
          <div className="p-4 border border-border rounded-md bg-muted/50">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Required Permission</span>
            </div>
            
            {missingRole ? (
              <p className="text-sm">
                You need <span className="font-semibold">{formatRoles(missingRole)}</span> role to access this page.
              </p>
            ) : (
              <p className="text-sm">
                This page requires administrator privileges.
              </p>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            Please contact your system administrator if you believe you should have access.
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
