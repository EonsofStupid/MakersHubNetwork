
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { UserRole } from '@/shared/types/shared.types';

interface AccessDeniedProps {
  missingRole?: UserRole | UserRole[];
  message?: string;
}

export function AccessDenied({ 
  missingRole, 
  message = "You don't have permission to access this area."
}: AccessDeniedProps) {
  // Format role for display
  const formatRole = (role: string) => {
    return role.replace('_', ' ').split(' ').map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get formatted role requirements
  const roleRequirement = missingRole 
    ? (Array.isArray(missingRole) 
        ? missingRole.map(formatRole).join(' or ') 
        : formatRole(missingRole)) 
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md w-full bg-background/20 backdrop-blur-xl border border-primary/30 rounded-lg shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <Shield className="h-10 w-10 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Access Denied</h1>
        
        <div className="text-center mb-6">
          <p className="text-muted-foreground mb-2">
            {message}
          </p>
          
          {roleRequirement && (
            <div className="flex items-center justify-center gap-2 text-sm p-2 bg-destructive/10 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span>Required role: <strong>{roleRequirement}</strong></span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Sign in with Another Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
