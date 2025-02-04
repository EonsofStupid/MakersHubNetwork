import { useAuthStore } from "@/stores/auth/store";

export const useAdminAccess = () => {
  const roles = useAuthStore((state) => state.roles);
  
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  
  return {
    isAdmin,
    hasAdminAccess: isAdmin,
  };
};