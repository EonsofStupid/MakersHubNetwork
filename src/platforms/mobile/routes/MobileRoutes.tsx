import { Routes, Route } from 'react-router-dom';
import { AuthGuard } from '@/components/AuthGuard';
import { MobileHomeView } from '@/features/home/MobileHomeView';

export const MobileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MobileHomeView />} />
      <Route 
        path="/admin" 
        element={
          <AuthGuard requiredRoles={['admin']}>
            <div>Admin Mobile View</div>
          </AuthGuard>
        } 
      />
    </Routes>
  );
};