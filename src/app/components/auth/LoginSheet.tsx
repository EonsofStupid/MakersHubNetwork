
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useToast } from '@/shared/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function LoginSheet() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-primary/10 border-primary/30 hover:bg-primary/20">
          Login
        </Button>
      </SheetTrigger>
      <SheetContent 
        className="w-full sm:max-w-md trapezoid-sheet"
        side="right"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/80 border-primary/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/80 border-primary/30"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full button-cyber"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="sheet-accent" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
