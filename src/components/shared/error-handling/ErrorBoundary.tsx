import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
    
    toast.error("An unexpected error occurred", {
      description: error.message,
      duration: 5000,
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} />;
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[400px] flex items-center justify-center p-4"
        >
          <Alert variant="destructive" className="max-w-xl bg-destructive/5 border-destructive/20">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="text-sm text-destructive/90 mb-4">
                {this.state.error?.message || "An unexpected error occurred"}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-background/50 hover:bg-background/80"
                onClick={this.handleReset}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;