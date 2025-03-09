
import { adminRouter } from '@/admin/router';
import { RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AdminWithTanstack() {
  const isDev = process.env.NODE_ENV === 'development';
  const { toast } = useToast();
  
  useEffect(() => {
    // Welcome toast for admin panel
    toast({
      title: "Admin Panel",
      description: "Welcome to the MakersImpulse admin dashboard",
    });
  }, [toast]);
  
  return (
    <>
      <RouterProvider router={adminRouter} />
      {isDev && (
        <>
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
          <TanStackRouterDevtools initialIsOpen={false} position="bottom-left" />
        </>
      )}
    </>
  );
}
