
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

interface LoginProps {
  onSuccess?: () => void;
}

const Login = ({ onSuccess }: LoginProps) => {
  const navigate = useNavigate();
  
  // Just redirect to home page, no authentication needed
  useEffect(() => {
    // Auto redirect after a small delay
    const timer = setTimeout(() => {
      onSuccess?.();
      navigate("/");
    }, 500);
    
    return () => clearTimeout(timer);
  }, [navigate, onSuccess]);

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute inset-0 bg-[#102030] opacity-80"></div>
        <div className="absolute inset-0 mainnav-data-stream animate-data-stream"></div>
        <div className="absolute inset-0 mainnav-glitch-particles"></div>
      </div>
      
      <Card className="w-full max-w-md border-primary/20 bg-background/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-primary cyber-effect-text">
            Welcome
          </CardTitle>
          <CardDescription>Public access enabled for all users</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center">
          <p className="mb-6 text-center">
            All features are publicly accessible. You'll be redirected automatically.
          </p>
          
          <div className="flex flex-col w-full gap-4">
            <Button 
              onClick={() => navigate("/")} 
              className="w-full cyber-effect-text relative group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              Continue to Home
            </Button>
            
            <div className="relative flex items-center justify-center">
              <Divider className="absolute w-full" />
              <span className="relative bg-card px-2 text-xs text-muted-foreground">
                or
              </span>
            </div>
            
            <GoogleLoginButton
              fullWidth
              onSuccess={() => navigate("/")}
              variant="outline"
              cyberpunk={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
