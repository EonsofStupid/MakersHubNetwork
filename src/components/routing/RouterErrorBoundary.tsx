
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface RouterErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetRoute?: string;
}

interface RouterErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// This component wraps the error boundary logic - we need this to use hooks
export const RouterErrorBoundary: React.FC<RouterErrorBoundaryProps> = (props) => {
  const { toast } = useToast();
  
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error("Router error caught:", error, errorInfo);
    
    toast({
      variant: "destructive",
      title: "Navigation Error",
      description: error.message || "An error occurred during navigation"
    });
    
    if (props.onError) {
      props.onError(error, errorInfo);
    }
  };
  
  return <RouterErrorBoundaryClass {...props} onError={handleError} />;
};

// The actual class-based error boundary
class RouterErrorBoundaryClass extends Component<RouterErrorBoundaryProps, RouterErrorBoundaryState> {
  public state: RouterErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<RouterErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    if (this.props.resetRoute) {
      window.location.href = this.props.resetRoute;
    } else {
      window.location.href = "/";
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <Card className="p-6 m-4 border border-destructive/20 bg-background/80 backdrop-blur-md">
          <div className="flex flex-col items-center text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive animate-pulse" />
            <h2 className="text-xl font-bold text-destructive">Navigation Error</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {this.state.error?.message || "An unexpected error occurred during navigation"}
            </p>
            <div className="space-x-4">
              <Button 
                variant="outline" 
                onClick={this.handleReset}
              >
                Return to safety
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 text-left w-full">
                <summary className="text-sm text-muted-foreground cursor-pointer">Technical Details</summary>
                <pre className="mt-2 text-xs overflow-auto p-2 bg-muted/20 rounded">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
