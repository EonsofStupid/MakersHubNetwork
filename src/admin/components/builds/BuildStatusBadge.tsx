
import React from "react";
import { Badge } from "@/components/ui/badge";
import { BuildStatus } from "@/admin/types/build.types";
import { AlertCircle, CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface BuildStatusBadgeProps {
  status: BuildStatus;
}

export function BuildStatusBadge({ status }: BuildStatusBadgeProps) {
  const getStatusDetails = (status: BuildStatus) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Pending Review', 
          variant: 'outline', 
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> 
        };
      case 'approved':
        return { 
          label: 'Approved', 
          variant: 'default', 
          icon: <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> 
        };
      case 'rejected':
        return { 
          label: 'Rejected', 
          variant: 'destructive', 
          icon: <XCircle className="w-3.5 h-3.5 mr-1.5" /> 
        };
      case 'needs_revision':
        return { 
          label: 'Needs Revision', 
          variant: 'warning', 
          icon: <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> 
        };
      default:
        return { label: status, variant: 'outline', icon: null };
    }
  };
  
  const { label, variant, icon } = getStatusDetails(status);
  
  return (
    <Badge variant={variant as any} className="capitalize flex items-center">
      {icon}
      {label}
    </Badge>
  );
}
