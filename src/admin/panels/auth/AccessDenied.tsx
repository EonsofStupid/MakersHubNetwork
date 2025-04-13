
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { UserRole } from '@/shared/types/shared.types';

interface AccessDeniedProps {
  requiredRole?: UserRole | UserRole[];
  message?: string;
}

export function AccessDenied({ 
  requiredRole, 
  message 
}: AccessDeniedProps) {
  const navigate = useNavigate();
  
  // Format required role(s) for display
  const formatRoles = () => {
    if (!requiredRole) return '';
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.join(' or ');
    }
    
    return requiredRole;
  };
  
  const displayMessage = message || `You need ${formatRoles()} permissions to access this area.`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="max-w-md border-destructive/50">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl">Access Denied</CardTitle>
          </div>
          <CardDescription>
            {displayMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6 pt-2">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2 text-center p-4 border rounded-md bg-destructive/5">
              <Shield className="h-10 w-10 text-destructive mx-auto" />
              <p className="text-sm text-muted-foreground">
                The requested page requires elevated permissions that your account doesn't have.
              </p>
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
              <Button onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
