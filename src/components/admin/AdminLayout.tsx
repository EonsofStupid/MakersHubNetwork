
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

/**
 * @deprecated Use AdminLayout from @/admin/components/layouts/AdminLayout instead
 * This component is kept for backward compatibility
 */
export const AdminLayout: React.FC<{
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
  className?: string;
}> = ({ 
  children, 
  title = "Admin Dashboard",
  fullWidth = false,
  className 
}) => {
  const navigate = useNavigate();
  const logger = useLogger("AdminLayout", LogCategory.ADMIN);

  useEffect(() => {
    logger.warn("Using deprecated AdminLayout component. Please update imports to @/admin/components/layouts/AdminLayout");
    navigate("/admin");
  }, []);

  return null; // This component redirects to the new admin path
};

export default AdminLayout;
