
import { useCallback } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { createSearchParams } from '@/utils/router-helpers';

export function useRouting() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const navigateTo = useCallback((path: string, options?: { replace?: boolean; state?: any }) => {
    navigate(path, { 
      replace: options?.replace || false,
      state: options?.state 
    });
  }, [navigate]);
  
  const navigateWithParams = useCallback((path: string, params: Record<string, any>, options?: { replace?: boolean; state?: any }) => {
    navigate({
      pathname: path,
      search: `?${createSearchParams(params)}`,
    }, { 
      replace: options?.replace || false,
      state: options?.state 
    });
  }, [navigate]);
  
  const getCurrentPath = useCallback(() => {
    return location.pathname;
  }, [location.pathname]);
  
  const getSearchParam = useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);
  
  const getAllSearchParams = useCallback(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);
  
  const isCurrentRoute = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);
  
  return {
    navigateTo,
    navigateWithParams,
    navigateBack: () => window.history.back(),
    getCurrentPath,
    getSearchParam,
    getAllSearchParams,
    isCurrentRoute,
    location,
    searchParams,
    setSearchParams
  };
}

export { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
