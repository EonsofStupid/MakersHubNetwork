
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';
import { LoginForm } from '@/auth/components/LoginForm';
import { SignupForm } from '@/auth/components/SignupForm';
import { motion } from 'framer-motion';

type AuthMode = 'login' | 'signup';

export function LoginSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  const handleSuccess = () => {
    setIsOpen(false);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
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
          'sm:max-w-sm backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu',
          'before:content-[\'\'] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:pointer-events-none'
        )}
        style={{
          clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%)',
          transform: 'translateX(0) skew(-10deg)',
          transformOrigin: '100% 50%',
        }}
      >
        <motion.div
          className="transform skew-x-[10deg] origin-top-right"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <SheetHeader>
            <SheetTitle>{mode === 'login' ? 'Sign In' : 'Sign Up'}</SheetTitle>
            <SheetDescription>
              {mode === 'login' 
                ? 'Enter your credentials or create a new account.' 
                : 'Create a new account to get started.'}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 py-4">
            {mode === 'login' ? (
              <LoginForm onSuccess={handleSuccess} />
            ) : (
              <SignupForm onSuccess={handleSuccess} />
            )}

            <div className="text-center mt-4">
              <Button variant="link" type="button" onClick={toggleMode}>
                {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
