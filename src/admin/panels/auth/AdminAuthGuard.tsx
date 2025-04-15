
import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  // We're allowing all access for now, no auth checks
  return <>{children}</>;
}
