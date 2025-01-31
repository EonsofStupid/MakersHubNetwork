import { Routes, Route } from 'react-router-dom';
import { MobileHomeView } from '@/features/home/MobileHomeView';

export const MobileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MobileHomeView />} />
    </Routes>
  );
};