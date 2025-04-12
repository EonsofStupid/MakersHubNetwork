
import { useAuthStore } from "@/auth/store/auth.store";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory, UserRole } from "@/shared/types/shared.types";

/**
 * Check if a user has a specific role
 */
export function useHasAdminRole(requiredRole: UserRole | UserRole[]): boolean {
  const roles = useAuthStore(state => state.roles);
  const logger = useLogger("useHasAdminRole", LogCategory.ADMIN);

  // If user is a super_admin, they have all roles
  if (roles.includes("super_admin")) {
    logger.debug("User has super_admin role, granting access", {
      details: { requiredRole }
    });
    return true;
  }

  // Check if role matches any of the required roles
  if (Array.isArray(requiredRole)) {
    const hasRole = requiredRole.some(role => roles.includes(role));
    
    logger.debug(`User role check: ${hasRole ? "granted" : "denied"}`, {
      details: { 
        userRoles: roles,
        requiredRoles: requiredRole,
        hasAccess: hasRole
      }
    });
    
    return hasRole;
  }
  
  const hasRole = roles.includes(requiredRole);

  logger.debug(`User role check: ${hasRole ? "granted" : "denied"}`, {
    details: { 
      userRoles: roles,
      requiredRole,
      hasAccess: hasRole
    }
  });
  
  return hasRole;
}

/**
 * Check if a user has either admin or super_admin role
 */
export function useIsAdmin(): boolean {
  return useHasAdminRole(["admin", "super_admin"]);
}

/**
 * Check if a user has the super_admin role
 */
export function useIsSuperAdmin(): boolean {
  return useHasAdminRole("super_admin");
}

/**
 * Get the highest role a user has
 */
export function useHighestRole(): UserRole {
  const roles = useAuthStore(state => state.roles);
  
  if (roles.includes("super_admin")) {
    return "super_admin";
  }
  
  if (roles.includes("admin")) {
    return "admin";
  }
  
  if (roles.includes("moderator")) {
    return "moderator";
  }
  
  if (roles.includes("builder")) {
    return "builder";
  }
  
  return "user";
}
