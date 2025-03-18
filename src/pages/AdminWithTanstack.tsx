
// This file has been deprecated in favor of the React Router DOM approach
// For backwards compatibility, redirect to the regular admin route

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminWithTanstack() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new admin route
    navigate('/admin');
  }, [navigate]);
  
  return null;
}
