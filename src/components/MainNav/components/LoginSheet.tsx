
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Mail, AtSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { publishAuthEvent } from "@/auth/bridge";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

interface LoginSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginSheet: React.FC<LoginSheetProps> = ({ isOpen, onOpenChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();
  const logger = useLogger("LoginSheet", LogCategory.AUTH);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Use the auth context for login
      await signIn(email, password);
      
      // Notify system of login through bridge
      publishAuthEvent({
        type: 'AUTH_SIGNED_IN',
        payload: { email }
      });
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      onOpenChange(false);
      
    } catch (error) {
      logger.error("Login failed", { details: { error } });
      
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[450px] border-primary/20 bg-background/95 backdrop-blur-xl">
        <SheetHeader className="space-y-2 mb-8">
          <SheetTitle className="text-2xl font-heading text-primary">
            Welcome
          </SheetTitle>
          <SheetDescription>
            Login to access your account or create a new one
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="login" className="cyber-text">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-6 py-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-primary/30 focus:border-primary"
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
                  className="border-primary/30 focus:border-primary"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full cyber-effect-text" 
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Login"}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/30" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button variant="outline" type="button" className="cyber-effect-text">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              
              <Button variant="outline" type="button" className="cyber-effect-text">
                <AtSign className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input 
                id="register-email" 
                type="email" 
                placeholder="you@example.com"
                className="border-primary/30 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input 
                id="register-password" 
                type="password"
                placeholder="Create a strong password"
                className="border-primary/30 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password"
                placeholder="Confirm your password"
                className="border-primary/30 focus:border-primary"
              />
            </div>
            
            <Button className="w-full cyber-effect-text">
              Create Account
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </div>
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="mt-8 flex flex-col text-center">
          <p className="text-xs text-muted-foreground">
            Protected by MakersImpulse cybersecurity
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
