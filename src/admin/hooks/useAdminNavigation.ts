
import { useNavigate } from 'react-router-dom';
import { useAdminPermissions } from './useAdminPermissions';
import { UserRole } from '@/shared/types/shared.types';

export function useAdminNavigation() {
  const navigate = useNavigate();
  const { hasRole } = useAdminPermissions();
  
  const navigateToAdmin = () => {
    navigate('/admin');
  };
  
  const navigateToDashboard = () => {
    navigate('/admin/dashboard');
  };
  
  const navigateToBuilds = () => {
    navigate('/admin/builds');
  };
  
  const navigateToReviews = () => {
    navigate('/admin/reviews');
  };
  
  const navigateToSettings = () => {
    navigate('/admin/settings');
  };
  
  const navigateToUsers = () => {
    navigate('/admin/users');
  };
  
  const navigateToThemes = () => {
    navigate('/admin/themes');
  };
  
  const hasAdminAccess = () => {
    return hasRole([UserRole.ADMIN, UserRole.SUPERADMIN]);
  };
  
  return {
    navigateToAdmin,
    navigateToDashboard,
    navigateToBuilds,
    navigateToReviews,
    navigateToSettings,
    navigateToUsers,
    navigateToThemes,
    hasAdminAccess
  };
}

export default useAdminNavigation;
