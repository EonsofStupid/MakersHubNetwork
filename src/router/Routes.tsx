
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainNavLayout } from '@/app/components/layout/MainNav';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { OverviewDashboard } from '@/admin/features/overview/OverviewDashboard';

// Create a router with main routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainNavLayout />,
    children: [
      {
        index: true,
        element: <div>Home Page</div>
      },
      {
        path: 'dashboard',
        element: <div>User Dashboard</div>
      },
      {
        path: 'profile',
        element: <div>User Profile</div>
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <OverviewDashboard />
      },
      {
        path: 'users',
        element: <div>User Management</div>
      },
      {
        path: 'settings',
        element: <div>Settings</div>
      }
    ]
  },
  {
    path: '/auth',
    element: <div>Auth Page</div>
  }
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
