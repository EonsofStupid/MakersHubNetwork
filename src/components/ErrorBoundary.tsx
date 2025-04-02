
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { useErrorLogger } from "@/hooks/use-error-logger";
import { safeDetails } from "@/logging/utils/safeDetails";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", safeDetails(error), errorInfo);
    
    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 m-2 text-center border border-destructive/20 rounded-md bg-background/40 backdrop-blur-md shadow-sm">
          <AlertCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
          <h2 className="text-base font-medium text-destructive mb-1">Something went wrong</h2>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            {this.state.error?.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
