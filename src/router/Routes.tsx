
import { createBrowserRouter } from 'react-router-dom';
import { PlaceholderPage } from '@/admin/components/PlaceholderPage';

// Main routes
const router = createBrowserRouter([
  {
    path: '/',
    // This is a placeholder for the real HomePage component
    // This will be replaced when migrating Home components
    element: <div>Home Page</div>,
  },
  {
    path: '/admin',
    // This is a placeholder for the real AdminPage component
    // This will be replaced when migrating admin routes
    element: <PlaceholderPage 
      title="Admin Dashboard" 
      description="Welcome to the admin dashboard, where you can manage your application." 
      requiredPermission="admin.access"
    />,
  }
]);

export default router;
