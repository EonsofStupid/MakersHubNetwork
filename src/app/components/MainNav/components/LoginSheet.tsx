
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/ui/core/sheet";
import { Button } from "@/ui/core/button";
import { Input } from "@/ui/core/input";
import { Label } from "@/ui/core/label";
import { useToast } from "@/hooks/use-toast";
import { authBridge } from "@/bridges";
import { FcGoogle } from "react-icons/fc";

interface LoginSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginSheet = ({ open, onOpenChange }: LoginSheetProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Invalid input",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = await authBridge.signIn(email, password);
      
      if (user) {
        toast({
          title: "Logged in",
          description: `Welcome back, ${user.user_metadata?.name || user.email}`,
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await authBridge.signInWithGoogle();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred with Google login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sign In</SheetTitle>
          <SheetDescription>
            Sign in to your account to continue.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
