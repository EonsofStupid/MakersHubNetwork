
import React from 'react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  // We're allowing all access with no auth checks
  return <>{children}</>;
}
