
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging/types";

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
  const logger = useLogger("AdminLayout (deprecated)", LogCategory.ADMIN);
  const loggedWarningRef = useRef(false);

  useEffect(() => {
    // Only log the warning once to prevent log spam
    if (!loggedWarningRef.current) {
      loggedWarningRef.current = true;
      logger.warn("Using deprecated AdminLayout component. Please update imports to @/admin/components/layouts/AdminLayout");
    }
    
    // Don't automatically navigate as this can cause unexpected behavior
    // Just render a warning message instead
  }, [logger]);

  return (
    <div className="p-4 border border-red-300 bg-red-50 rounded-md">
      <h2 className="text-lg font-medium text-red-800 mb-2">Deprecated Component</h2>
      <p className="text-red-600 mb-4">
        This AdminLayout component is deprecated. Please update your imports to use:
        <br />
        <code className="bg-red-100 px-2 py-1 rounded">@/admin/components/layouts/AdminLayout</code>
      </p>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
