
import React from 'react';
import { Outlet } from '@tanstack/react-router';

// Re-export the admin routes from the central router
export { adminRoutes } from '@/router/routes/admin';

// Export AdminRoutes component that's already defined in AdminRoutes.tsx
export { AdminRoutes } from './AdminRoutes';
