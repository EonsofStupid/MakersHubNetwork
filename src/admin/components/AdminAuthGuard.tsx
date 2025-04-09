
import React from 'react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

// Admin auth guard that doesn't actually guard anything
export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  // Always render the children, no authentication checks
  return <>{children}</>;
}
