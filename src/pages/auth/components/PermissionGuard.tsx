import { ReactNode } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';

interface PermissionGuardProps {
  children: ReactNode;
  requiredRole?: string;
}

export const PermissionGuard = ({ children, requiredRole = 'user' }: PermissionGuardProps) => {
  const session = useSession();
  const { toast } = useToast();

  if (!session) {
    toast({
      variant: "destructive",
      title: "Access Denied",
      description: "You must be logged in to access this content.",
    });
    return null;
  }

  const userRole = session.user.role; // Assuming user role is stored in session.user.role

  if (userRole !== requiredRole) {
    toast({
      variant: "destructive",
      title: "Access Denied",
      description: `You need the ${requiredRole} role to access this content.`,
    });
    return null;
  }

  return <>{children}</>;
};
