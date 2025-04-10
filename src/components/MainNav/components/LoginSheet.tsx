
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Mail, AtSign, Wrench, LayoutDashboard, Shield, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthBridge } from "@/auth/bridge";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";
import { useAuthStore } from "@/auth/store/auth.store";

/**
 * LoginSheet Component
 * 
 * Modal component for user authentication, providing login and registration options.
 * Uses the cyberpunk styling and integrates with the auth system.
 */
interface LoginSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginSheet: React.FC<LoginSheetProps> = ({ isOpen, onOpenChange }) => {
  // Local UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setSocialLoading] = useState<Record<string, boolean>>({
    google: false,
    github: false
  });
  
  // Hooks
  const { toast } = useToast();
  const logger = useLogger("LoginSheet", LogCategory.AUTH);
  
  // Auth state from store using selectors for performance
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const roles = useAuthStore(state => state.roles);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isAdmin = useAuthStore(state => state.isAdmin());
  const isSuperAdmin = useAuthStore(state => state.isSuperAdmin());

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
      
      // Use AuthBridge directly to avoid circular dependencies
      await AuthBridge.signIn(email, password);
      
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

  const handleGoogleLogin = async () => {
    try {
      setSocialLoading(prev => ({ ...prev, google: true }));
      
      // Use auth bridge to handle Google login with popup
      await AuthBridge.signInWithGoogle();
      
      // This will redirect the user to Google login
      // We don't need to handle success here as the auth state change 
      // will be captured by the Supabase auth listener
      
    } catch (error) {
      logger.error("Google login failed", { details: { error } });
      
      toast({
        title: "Google login failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };

  // Determine if the user has admin access
  const hasAdminAccess = isAdmin || isSuperAdmin;

  // Log the admin status for debugging
  React.useEffect(() => {
    if (isAuthenticated) {
      logger.info('User authenticated status', { 
        details: { 
          userId: user?.id,
          isAdmin,
          isSuperAdmin,
          hasAdminAccess,
          roles 
        }
      });
    }
  }, [isAuthenticated, user?.id, isAdmin, isSuperAdmin, hasAdminAccess, roles, logger]);

  // Render content based on authentication status
  if (isAuthenticated) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side="right" 
          className="w-full sm:w-[450px] border-primary/20 bg-background/20 backdrop-blur-xl"
        >
          <div className="absolute inset-0 z-[-1] overflow-hidden">
            <div className="absolute inset-0 bg-[#102030] opacity-90"></div>
            <div className="absolute inset-0 mainnav-data-stream animate-data-stream"></div>
            <div className="absolute inset-0 mainnav-glitch-particles"></div>
          </div>
          
          <SheetHeader className="space-y-2 mb-8 relative z-10">
            <SheetTitle className="text-2xl font-heading text-primary cyber-effect-text">
              {isSuperAdmin ? "Super Admin Dashboard" : (isAdmin ? "Admin Dashboard" : "Dashboard")}
            </SheetTitle>
            <SheetDescription className="text-primary/80">
              {`Logged in as ${user?.email}`}
            </SheetDescription>
          </SheetHeader>

          <div className="relative z-10">
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                    <img 
                      src={profile?.avatar_url || user?.user_metadata?.avatar_url as string} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-primary">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {profile?.display_name || user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-1 flex flex-wrap gap-2">
                {roles.map((role) => (
                  <div 
                    key={role}
                    className="flex items-center space-x-2 text-xs bg-primary/5 border border-primary/20 rounded px-2 py-1"
                  >
                    {role === 'super_admin' && <Crown className="h-3 w-3 text-secondary" />}
                    {role === 'admin' && <Shield className="h-3 w-3 text-primary" />}
                    <span>{role.replace("_", " ")}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/profile" onClick={() => onOpenChange(false)}>
                    <Mail className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </Button>
                
                {hasAdminAccess && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-primary/5 border-primary/30 hover:bg-primary/10" 
                    asChild
                  >
                    <Link to="/admin" onClick={() => onOpenChange(false)}>
                      {isSuperAdmin ? (
                        <Crown className="mr-2 h-4 w-4 text-secondary" />
                      ) : (
                        <Shield className="mr-2 h-4 w-4 text-primary" />
                      )}
                      Admin Dashboard
                    </Link>
                  </Button>
                )}

                <Button 
                  variant="destructive" 
                  className="w-full mt-6" 
                  onClick={async () => {
                    try {
                      await AuthBridge.logout();
                      toast({
                        title: "Logged out",
                        description: "You have been successfully logged out"
                      });
                      onOpenChange(false);
                    } catch (error) {
                      logger.error("Logout failed", { details: { error } });
                      toast({
                        title: "Logout failed",
                        description: "An error occurred while logging out",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>
          
          <SheetFooter className="mt-8 flex flex-col text-center">
            <p className="text-xs text-muted-foreground">
              Protected by MakersImpulse cybersecurity
            </p>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[450px] border-primary/20 bg-background/20 backdrop-blur-xl"
      >
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <div className="absolute inset-0 bg-[#102030] opacity-90"></div>
          <div className="absolute inset-0 mainnav-data-stream animate-data-stream"></div>
          <div className="absolute inset-0 mainnav-glitch-particles"></div>
        </div>
        
        <SheetHeader className="space-y-2 mb-8 relative z-10">
          <SheetTitle className="text-2xl font-heading text-primary cyber-effect-text">
            Welcome
          </SheetTitle>
          <SheetDescription className="text-primary/80">
            Login to access your account or create a new one
          </SheetDescription>
        </SheetHeader>

        <div className="relative z-10">
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
                <Button 
                  variant="outline" 
                  type="button" 
                  className="cyber-effect-text relative group overflow-hidden"
                  onClick={handleGoogleLogin}
                  disabled={isSocialLoading.google}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                  {isSocialLoading.google ? "Connecting..." : "Google"}
                </Button>
                
                <Button 
                  variant="outline" 
                  type="button" 
                  className="cyber-effect-text relative group overflow-hidden"
                  disabled={isSocialLoading.github}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <Github className="mr-2 h-4 w-4" />
                  Github
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
        </div>
        
        <SheetFooter className="mt-8 flex flex-col text-center">
          <p className="text-xs text-muted-foreground">
            Protected by MakersImpulse cybersecurity
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
