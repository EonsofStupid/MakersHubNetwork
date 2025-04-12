
import { createBrowserRouter } from 'react-router-dom';

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
    element: <div>Admin Dashboard</div>,
  }
]);

export default router;
