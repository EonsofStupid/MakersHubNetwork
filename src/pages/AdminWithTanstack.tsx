
import { adminRouter } from '@/admin/router';
import { RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function AdminWithTanstack() {
  const isDev = process.env.NODE_ENV === 'development';
  const { toast } = useToast();
  const [showDevTools, setShowDevTools] = useState(false);
  
  useEffect(() => {
    // Welcome toast for admin panel
    toast({
      title: "Admin Panel",
      description: "Welcome to the MakersImpulse admin dashboard",
    });
    
    // Delay loading dev tools to ensure router is initialized
    if (isDev) {
      const timer = setTimeout(() => {
        setShowDevTools(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [toast, isDev]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="admin-tanstack-wrapper"
    >
      <RouterProvider router={adminRouter} />
      {isDev && showDevTools && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </motion.div>
  );
}
