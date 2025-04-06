
import { useState } from 'react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface LoginSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginSheet({ isOpen, onOpenChange }: LoginSheetProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn(email, password);
      toast({
        title: "Success!",
        description: isSignUp ? "Account created successfully" : "Logged in successfully",
      });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Authentication failed",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        className="backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
        side="right"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="text-primary text-2xl">
            {isSignUp ? "Create Account" : "Login"}
          </SheetTitle>
          <SheetDescription>
            {isSignUp 
              ? "Sign up to access all features" 
              : "Enter your credentials to access your account"}
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50"
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
              required
              className="bg-background/50"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading 
              ? "Processing..." 
              : (isSignUp ? "Create Account" : "Login")}
          </Button>
        </form>

        <SheetFooter className="flex-col items-center gap-2 mt-6">
          <div className="text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login instead" : "Create account"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
