
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useToast } from '@/shared/ui/use-toast';
import { authBridge } from '@/auth/bridge';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/SharedTypes';
import { Shield } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useAdminNavigation } from '@/admin/hooks/useAdminNavigation';
import { motion } from 'framer-motion';

export function LoginSheet() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const logger = useLogger('LoginSheet', LogCategory.AUTH);
  const { navigateToAdmin } = useAdminNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await authBridge.signInWithEmail(email, password);
      toast({
        title: 'Success',
        description: 'You have successfully logged in.',
      });
      setIsOpen(false);
    } catch (error) {
      logger.error('Login failed', {
        details: { error },
      });
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminClick = () => {
    setIsOpen(false);
    navigateToAdmin();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </SheetTrigger>

      <SheetContent
        className={cn(
          'trapezoid-sheet sm:max-w-sm backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu',
          'before:content-[\'\'] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:pointer-events-none'
        )}
      >
        <motion.div
          className="transform"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <SheetHeader>
            <SheetTitle>Sign In</SheetTitle>
            <SheetDescription>
              Enter your credentials to sign in.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {RBACBridge.hasAdminAccess() && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  className={cn(
                    'w-full bg-primary/5 hover:bg-primary/10',
                    'group relative overflow-hidden shimmer'
                  )}
                  onClick={handleAdminClick}
                >
                  <Shield className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-primary">Admin Dashboard</span>
                </Button>
              </div>
            )}
          </div>
        </motion.div>
        <div className="sheet-accent"></div>
      </SheetContent>
    </Sheet>
  );
}
