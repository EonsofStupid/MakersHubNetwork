
import { adminRouter } from '@/admin/router';
import { RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="admin-tanstack-wrapper"
    >
      <RouterProvider router={adminRouter} />
      {isDev && (
        <>
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
          <TanStackRouterDevtools initialIsOpen={false} position="bottom-left" />
        </>
      )}
    </motion.div>
  );
}
