
import React from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserRole } from "@/shared/types/shared.types";

interface AccessDeniedProps {
  missingRole?: UserRole | UserRole[];
}

export function AccessDenied({ missingRole }: AccessDeniedProps) {
  const formattedRole = React.useMemo(() => {
    if (!missingRole) return "appropriate permissions";
    
    if (Array.isArray(missingRole)) {
      if (missingRole.length === 1) {
        return `'${missingRole[0]}' role`;
      }
      if (missingRole.length === 2) {
        return `'${missingRole[0]}' or '${missingRole[1]}' role`;
      }
      const lastRole = missingRole[missingRole.length - 1];
      const otherRoles = missingRole.slice(0, -1).join("', '");
      return `'${otherRoles}', or '${lastRole}' role`;
    }
    
    return `'${missingRole}' role`;
  }, [missingRole]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="max-w-md p-8 border border-red-200 bg-red-50 rounded-lg shadow-lg space-y-6 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <Shield className="h-16 w-16 text-red-300" />
            <AlertTriangle className="h-8 w-8 absolute bottom-0 right-0 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-red-800">Access Denied</h1>
        
        <p className="text-red-600">
          {missingRole ? (
            <>
              You need {formattedRole} to access this area.
            </>
          ) : (
            <>
              You don't have permission to access this area.
            </>
          )}
        </p>
        
        <div className="pt-4 space-y-3">
          <Button asChild variant="outline" className="w-full">
            <Link to="/admin">Return to Dashboard</Link>
          </Button>
          <Button asChild variant="default" className="w-full">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
